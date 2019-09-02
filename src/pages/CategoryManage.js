import React, { Component } from 'react';
import { Button, Table,Modal ,Form ,Input,Select,Radio} from 'antd';
import axios from '../utils/axios';
import config from '../utils/config';
const { Option } = Select;
const { TextArea } = Input;

class CategoryManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          tableData: [],
          // 批量删除的id的数组
          ids: [],
          // 模态框的显示与隐藏
          visible: false,
          // 模态框的标题
          modalTitle: '新增栏目信息',
          // 模态框需要遍历的栏目的信息
          categoryData: [],
          // 表单数据
          form: {
              
          }
        };
      }
    componentDidMount() {
        this.findAllCategory();
    }
      // 获取数据
      findAllCategory = () => {
        axios.get('/manager/category/findAllCategory').then((res) => {
        // res是axios封装过后的数据 data属性上才是后台服务器给出的数据
        // console.log(res.data);
        this.setState({
            tableData: res.data,
            categoryData:res.data
            
        });
        }).catch((err) => {
        console.log(err);
        });
    } 
    // 表单控件更改
    formChange = (attr, e) => {
        let { form } = this.state;
        form[attr] = e.target.value;
        this.setState({
        form
        });
    }
    // 下拉列表控件更改  Select的chang上直接携带了value值
    selectChange = (value) => {
        let { form } = this.state;
        console.log(value,'name')
        form.parentId = value;
        this.setState({
        form
        });
    }
     // 编辑
    toEdit = (record) => {
        let { form } = this.state;
        // console.log(record,"00000");
        form = {
            ...form,
            id: record.id,
            name: record.name,
            parentId: (record.parent)?record.parent.id:null,
            comment: record.comment,
            
        };
        console.log(form,"10000")
        this.setState({
            form,
            modalTitle: '修改栏目信息'
        })
        this.showModal();
        this.findAllCategory();
    }
    // 新增  模态框显示，如果点了模态框的确定的时候，获取state的数据提交给后台
    toAdd = () => {
        this.setState({
            form: {},
            modalTitle: '新增栏目信息'  
        });
        this.showModal();
        this.findAllCategory();
    }
     // 单个删除
    toDelete = (id) => {
        // id就是要删除的数据
        axios.get('/manager/category/deleteCategoryById', { params: { id } }).then(() => {
        this.findAllCategory();
        }).catch((err) => {
        console.log(err);
        });
    }
     // 模态框显示
    showModal = () => {
        this.setState({
        visible: true,
        });
    };
    // 模态框点击确定
    toSave = e => {
        // 保存数据，关闭模态框
        axios.post('/manager/category/saveOrUpdateCategory', this.state.form).then(() => {
        this.findAllCategory();
        this.setState({
            visible: false,
        });
        }).catch((error) => {
            console.log(error);
        });
    };
    // 模态框点击取消
    handleCancel = e => {
        // console.log(e);
        this.setState({
        visible: false,
        });
    };
    // 批量删除
    toBatchDelete = () => {
        // 发送ids给后台
        axios.post('/manager/category/batchDeleteCategory', { ids: this.state.ids.toString() }).then(() => {
        // 添加提示，提示用户删除成功
        this.findAllCategory();
        }).catch((err) => {
        console.log(err);
        });
    }
    render() {
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
          };
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              // console.log(selectedRowKeys, selectedRows);
              // selectedRowKeys就是要删除的元素的id组成的数组
              this.setState({
                ids: selectedRowKeys
              });
            }
          };
          const columns = [{
            title: '名称',
            dataIndex: 'name'
          }, {
            title: '父栏目',
            dataIndex: 'parent.name'
          }, {
            title: '描述',
            dataIndex: 'comment'
          }, {
            title: '操作',
            dataIndex: '',
            render: (text, record) => {
              // text属性值  
              //record一行记录，对象
              return (
                <div>
                  <Button type="primary" onClick={this.toEdit.bind(this, record)} size="small">修改</Button>
                  <Button type="danger" onClick={this.toDelete.bind(this, record.id)} size="small">删除</Button>
                </div>
              );
            }
          }];
          const { form } = this.state;
          console.log(form,"///");
        return (
            <div className="article-manage">
                <div className="btns-div">
                    <Button type="primary" onClick={this.toAdd}>新增</Button>
                    <Button type="danger" onClick={this.toBatchDelete}>批量删除</Button>
                </div>
                <div className="table-div">
                    <Table size="small" rowKey="id" rowSelection={rowSelection} dataSource={this.state.tableData} columns={columns} pagination={this.state.pagination} onChange={this.pageChange}></Table>
                </div>
                <Modal
                title={this.state.modalTitle}
                visible={this.state.visible}
                onOk={this.toSave}
                onCancel={this.handleCancel}
                okText="确定"
                cancelText="取消"
                >
                {/* {JSON.stringify(form)} */}
                {console.log(form,"-----")}
                <Form {...formItemLayout}>
                    <Form.Item label="栏目名称">
                        <Input value={form.name} onChange={this.formChange.bind(this, 'name')} />
                    </Form.Item>
                    <Form.Item label="父栏目">
                        <Select value={form.parentId} onChange={this.selectChange}>
                            {/* 遍历category的数据 */}
                            {
                                this.state.categoryData.map((item, index) => {
                                    return <Option value={item.id} key={index}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    
                    <Form.Item label="栏目描述">
                        <TextArea value={form.comment} onChange={this.formChange.bind(this, 'comment')} rows={4} />
                    </Form.Item>
                </Form>
                </Modal>
            </div>
        );
    }
}

export default CategoryManage;