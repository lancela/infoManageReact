import React, { Component } from 'react';
import { Button, Table, Modal, Form, Input, Select, Radio } from 'antd';
import axios from '../utils/axios';
import config from '../utils/config';
const { Option } = Select;
const { TextArea } = Input;
// 将js数据转成表单个数的数据
class ArticleManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      currentPage: 1,
      pagination: {
        pageSize: config.pageSize,
        total: 0
      },
      // 批量删除的id的数组
      ids: [],
      // 模态框的显示与隐藏
      visible: false,
      // 模态框的标题
      modalTitle: '新增文章信息',
      // 模态框需要遍历的栏目的信息
      categoryData: [],
      // 表单数据
      form: {}
    };
  }
  componentDidMount() {
    this.findArticleByPage();
  }
  // 获取数据
  findArticleByPage = () => {
    axios.get('/manager/article/findArticle', { params: { page: this.state.currentPage - 1, pageSize: this.state.pagination.pageSize } }).then((res) => {
      // res是axios封装过后的数据 data属性上才是后台服务器给出的数据
      // console.log(res.data);
      // console.log(res);
      this.setState({
        tableData: res.data.list,
        pagination: {
          ...this.state.pagination,
          total: res.data.total
        }
      });
    }).catch((err) => {
      console.log(err);
    });

    /* $.ajax({
      ...
      success(res){
        let obj = {
          data:res,
          status:,
          test:'rrr'
        };
        resolve(obj)
      }
    }) */
  }
  //页数更改事件处理程序
  pageChange = (pagination) => {
    // console.log(pagination.current);
    // 修改数据模型中的数据为当前页数
    this.setState({
      currentPage: pagination.current
    }, () => {
      this.findArticleByPage();
    })
  }
  // 批量删除
  toBatchDelete = () => {
    // 发送ids给后台
    axios.post('/manager/article/batchDeleteArticle', { ids: this.state.ids.toString() }).then(() => {
      // 添加提示，提示用户删除成功
      this.findArticleByPage();
    }).catch((err) => {
      console.log(err);
    });
  }
  // 新增  模态框显示，如果点了模态框的确定的时候，获取state的数据提交给后台
  toAdd = () => {
    this.setState({
      form: {},
      modalTitle: '新增文章信息'
    });
    this.findAllCategory();
    
  }
  // 单个删除
  toDelete = (id) => {
    // id就是要删除的数据
    axios.get('/manager/article/deleteArticleById', { params: { id } }).then(() => {
      this.findArticleByPage();
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
    axios.post('/manager/article/saveOrUpdateArticle', this.state.form).then(() => {
      this.findArticleByPage();
      this.setState({
        visible: false,
      });
    }).catch((error) => {
      console.log(error);
    });
  };
  // 模态框点击取消
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  // 查找所有的栏目信息
  findAllCategory = () => {
    axios.get('/manager/category/findAllCategory').then((res) => {
      console.log(res);
      // state，显示模态框
      this.setState({
        categoryData: res.data
      }, () => {
        this.showModal();
      });
    }).catch((error) => {
      console.log(error);
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
    form.categoryId = value;
    this.setState({
      form
    });
  }
  // 编辑
  toEdit = (record) => {
    let { form } = this.state;
    form = {
      ...form,
      id: record.id,
      title: record.title,
      liststyle: record.liststyle,
      content: record.content,
      categoryId: record.category ? record.category.id : '',
      // 获取年月日时分秒
      publishtime: config.parseDate(),
      readtimes: 0
    };
    this.setState({
      form,
      modalTitle: '修改文章信息'
    })
    this.findAllCategory();
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
      title: '文章标题',
      dataIndex: 'title'
    }, {
      title: '所属栏目',
      dataIndex: 'category.name'
    }, {
      title: '排列方式',
      dataIndex: 'liststyle'
    }, {
      title: '发布时间',
      dataIndex: 'publishtime'
    }, {
      title: '阅读次数',
      dataIndex: 'readtimes'
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
          <Form {...formItemLayout}>
            <Form.Item label="标题">
              <Input value={form.title} onChange={this.formChange.bind(this, 'title')} />
            </Form.Item>
            <Form.Item label="所属栏目">
              <Select value={form.categoryId} onChange={this.selectChange}>
                {/* 遍历category的数据 */}
                {
                  this.state.categoryData.map((item, index) => {
                    return <Option value={item.id} key={index}>{item.name}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item label="排列方式">
              <Radio.Group>
                <Radio value="style-one" checked={form.liststyle === 'style-one'} onChange={this.formChange.bind(this, 'liststyle')}>排列方式一</Radio>
                <Radio value="style-two" checked={form.liststyle === 'style-two'} onChange={this.formChange.bind(this, 'liststyle')}>排列方式二</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="内容">
              <TextArea value={form.content} onChange={this.formChange.bind(this, 'content')} rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ArticleManage;