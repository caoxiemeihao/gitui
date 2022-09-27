import { homeDir } from '@tauri-apps/api/path'
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watch,
} from 'vue'
import {
  type TableProps,
  Table,
  message,
  Tooltip,
  Badge,
  Form,
  Input,
  Button,
  Tag,
  Space,
  Popconfirm,
  Spin,
  Modal,
} from 'ant-design-vue'
import {
  UserOutlined,
  MailOutlined,
  LoadingOutlined,
} from '@ant-design/icons-vue'
import { useDrop } from '@/hooks/useDrop'
import { getUser, setUser } from '@/utils/git'
import { local } from '@/utils/store'
import { classname } from '@/utils/function'
import {
  type RecordGit,
  readGitRepository,
  path2git,
  path2name,
} from './utils'
import './index.less'

type GitUser = Omit<RecordGit, 'path'>
const GIT_USERS = 'git-users'
const GIT_COLOR = { global: '#bd34fe', local: 'cyan' }

export default defineComponent({
  name: 'git-config',
  setup() {
    const { status, paths: dropPaths } = useDrop()
    const paths = ref<string[]>([])
    const dataSource = ref<RecordGit[]>([])
    const selectedRowKeys = ref<(string | number)[]>([])
    const formState = reactive({ name: '', email: '' })
    const gitUsers = ref<GitUser[]>([])
    const spinning = reactive({ git: false, table: false })

    const initGits = (global: GitUser = gitUsers.value[0] ?? { name: '', email: '', }) => {
      // The first item always global user
      gitUsers.value = [global, ...(local.get(GIT_USERS) ?? [])]
    }

    const saveGitUser = () => {
      formState.name = formState.name.trim()
      formState.email = formState.email.trim()

      if (gitUsers.value.find(user => user.email === formState.email)) {
        message.warn(`${[formState.name, formState.email].join(' | ')} - 已存在`)
      } else {
        const [/* global */, ...arr] = gitUsers.value.concat(formState)
        local.set(GIT_USERS, arr)
        initGits()
      }
    }

    const modifyGitUser = () => {
      Modal.confirm({
        title: '下列仓库将会被修改为',
        content: (
          <div class='text-left'>
            <h4 class='m-0'>{[formState.name || '空', formState.email || '空'].join(' | ')}</h4>
            {selectedRowKeys.value.map(path => <div>{path2name(path as string)}</div>)}
          </div>
        ),
        async onOk() {
          spinning.table = true
          let error: GitUser | undefined
          for (const path of selectedRowKeys.value as string[]) {
            // 清除缓存
            path2git.cache.delete(path)
            error = await setUser({
              path,
              name: formState.name,
              email: formState.email,
            })
            if (error) {
              break
            }
          }
          if (error) {
            message.error(error.email || error.name)
            return
          }
          message.success('修改成功')
          // 更新列表
          paths.value = [...paths.value]
          spinning.table = false
        },
      })
    }

    const removeGitUser = (user: GitUser) => {
      let users2 = local.get(GIT_USERS) as GitUser[]
      users2 = users2.filter(u => u.email !== user.email)
      local.set(GIT_USERS, users2)
      initGits()
    }

    const useGitUser = (user: GitUser) => {
      formState.name = user.name
      formState.email = user.email
    }

    const selectFromUser = (user: GitUser) => {
      selectedRowKeys.value = dataSource.value
        .filter(item => item.email === user.email)
        .map(item => item.path)
    }

    const removeSelected = () => {
      paths.value = paths.value.filter(path => !selectedRowKeys.value.includes(path))
      selectedRowKeys.value = []
    }

    /* const updatePaths = async (_paths: string[]) => {
      paths.value = _paths
      if (!_paths.length) {
        // 清空
        dataSource.value = []
        return
      }
      setTimeout(async function fn() {
        const path = _paths.pop()
        if (path) {
          // 一个个读取体验更好
          dataSource.value = dataSource.value.concat(await path2git(path))
          setTimeout(fn, 19)
        }
      }, 19)
    } */

    watch(status, s => {
      if (s === 'hover') {
        message.info('撒手读取拖放路径')
      }
    })

    watch(dropPaths, async ps => {
      if (ps) {
        const repos: (string | string[])[] = []
        for (const p of ps) {
          const repo = await readGitRepository(p)
          if (repo) {
            repos.push(repo)
          }
        }
        const _paths = repos.flat()
        const include = _paths.filter(path => paths.value.includes(path))
        const exclude = _paths.filter(path => !paths.value.includes(path))
        if (include.length) {
          message.warning(
            <div class='text-left'>
              {include
                .map(path => <div>{path2name(path)}</div>)
                .concat(<h4 class='text-center m-0'>已经存在</h4>)}
            </div>
          )
        }
        if (exclude.length) {
          paths.value = paths.value.concat(exclude)
        }
      }
    })

    watch(paths, async ([/* 直接操作 _paths.pop 会导致 paths.value 清空 */..._paths]) => {
      dataSource.value = []
      spinning.table = true
      await new Promise(resolve => {
        setTimeout(async function fn() {
          const path = _paths.pop()
          if (path) {
            // 一个个读取体验更好
            dataSource.value = dataSource.value.concat(await path2git(path))
            setTimeout(fn, 19)
          } else {
            resolve(true)
          }
        }, 19)
      })
      spinning.table = false
    })

      // on-create
      ; (async () => {
        spinning.git = true
        const home_dir = await homeDir()
        const { user } = await getUser(home_dir, { global: true })
        initGits(user)
        spinning.git = false
      })();

    const tableProps = computed<TableProps<RecordGit>>(() => ({
      columns: [
        {
          title: [dataSource.value.length, selectedRowKeys.value.length].join('/'),
          dataIndex: 'status',
          customRender: ({ record }) => {
            const global = gitUsers.value[0]?.email === record.email
            return (
              <div class='text-center'>
                <Badge color={global ? GIT_COLOR.global : GIT_COLOR.local} />
              </div>
            )
          },
          width: 70,
        },
        {
          title: '仓库',
          dataIndex: 'path',
          customRender: ({ value }) => (
            <Tooltip title={value}>
              {path2name(value)}
            </Tooltip>
          ),
        },
        {
          title: 'user.name',
          dataIndex: 'name',
        },
        {
          title: 'user.email',
          dataIndex: 'email',
        },
      ],
      dataSource: dataSource.value,
      pagination: false,
      size: 'small',
      rowKey: 'path',
      rowSelection: {
        onChange(rowKeys) {
          selectedRowKeys.value = rowKeys
        },
        selectedRowKeys: selectedRowKeys.value,
      },
    }))

    return () => (
      <div class='git-config h-100 d-flex'>
        <div class='left h-100 overflow-auto pl-2 pr-2'>
          <div class='git-repo flex-fill pt-3 pb-3'>
            {selectedRowKeys.value.map(key => (
              <Tag key={key} color='blue'>{path2name(key as string)}</Tag>
            ))}
          </div>
          <div class='git-form'>
            <Form
              model={formState}
              layout='vertical'
            >
              <Form.Item class='mb-2'>
                <Input
                  allowClear
                  prefix={<UserOutlined />}
                  v-model:value={formState.name}
                  placeholder='git config user.name'
                />
              </Form.Item>
              <Form.Item class='mb-2'>
                <Input
                  allowClear
                  prefix={<MailOutlined />}
                  v-model:value={formState.email}
                  placeholder='git config user.email'
                />
              </Form.Item>
              <div class='footer d-flex'>
                <Button
                  class='flex-fill'
                  onClick={saveGitUser}
                  size='small'
                >添加至列表</Button>
                <Button
                  class='flex-fill ml-2'
                  onClick={modifyGitUser}
                  size='small'
                  loading={spinning.table}
                >修改已选中</Button>
              </div>
            </Form>
          </div>
          <div class='git-user flex-fill pt-3 pb-3'>
            <Spin
              spinning={spinning.git}
              indicator={<LoadingOutlined />}
              class='w-100 pt-4 pb-4'
            />
            {gitUsers.value.map((user, index) => {
              const global = index === 0
              return (
                <div key={index} class='item d-flex align-items-center'>
                  <div class={classname(['user flex-fill mb-2 p-2', { global }])}>
                    <div class='name d-flex align-items-center justify-content-between'>
                      <span>{user.name}</span>
                      <Space>
                        {global ? null : (
                          <Popconfirm title='Are you sure?' onConfirm={() => removeGitUser(user)}>
                            <Button size='small'>删除</Button>
                          </Popconfirm>
                        )}
                        <Button size='small' onClick={() => useGitUser(user)}>使用</Button>
                      </Space>
                    </div>
                    <div class='email'>{user.email}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div class='middle h-100' />
        <div class='right position-relative h-100 flex-fill d-flex flex-column overflow-auto'>
          <div class='right-header pl-2'>
            <Space>
              <Badge color={GIT_COLOR.global} text='global' />
              <Badge color={GIT_COLOR.local} text='local' />
            </Space>
          </div>
          <div class='presentation position-absolute w-100' />
          <div class='right-content flex-fill p-2 overflow-auto'>
            <Spin spinning={spinning.table} indicator={<LoadingOutlined />}>
              <div class='d-flex justify-content-between mb-2'>
                <Space>
                  {gitUsers.value.map((user, index) => (
                    <Button
                      size='small'
                      type='primary'
                      key={index}
                      onClick={() => selectFromUser(user)}
                    >
                      <span>选择-{user.name}</span>
                      <Badge
                        count={dataSource.value.filter(item => item.email === user.email).length}
                        class='badge-classify'
                      />
                    </Button>
                  ))}
                </Space>
                <Button
                  size='small'
                  type='primary'
                  danger
                  onClick={removeSelected}
                >{selectedRowKeys.value.length ? '删除已选' : '刷新'}</Button>
              </div>
              <Table {...tableProps.value} />
            </Spin>
          </div>
        </div>
      </div>
    )
  },
})
