import React, { Component } from 'react';
import {Button,Card,Switch,Avatar,Form,Modal,Input} from 'antd';
import axios from 'axios';
class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state={
            userData:[],
            ids: [],
            // 模态框的显示与隐藏
            visible: false,
            // 模态框的标题
            modalTitle: '新增用户信息',
            form:{

            }

        }
    }
    componentDidMount(){
        this.findAllUser();
    }
    findAllUser=()=>{
        axios.get('/manager/user/findAllUser').then((res) => {
            console.log(res,"=====");
            this.setState({
                userData : res.data
            });
            console.log(this.state.userData,"----")
            }).catch((err) => {
            console.log(err);
            });
       
    }
    addUser=()=>{
        this.showModal();
        this.setState({
            form:[]
        })
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
        axios.post('/manager/user/saveOrUpdateUser', this.state.form).then(() => {
        this.findAllUser();
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
    formChange=(attr,e)=>{
        let { form } = this.state;
        form[attr] = e.target.value;
        this.setState({
        form
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
          const { form } = this.state;
        return (
            <div>
                <Button onClick={this.addUser} type="primary" style={{marginBottom:10, display:"block"}}>新增</Button>
               
               {console.log(this.state.userData)}
                {
                    this.state.userData.map((item,index)=>{
                        return (
                            <Card key={index} style={{ width: 300, display:"inlineBlock" ,textAlign:"center" ,fontSize:20,margin:20,float:"left"}}>
                                <Avatar shape="square" size={64} icon="user" />
                                <p>用户名:{item.username}</p>
                                <p>真实名:{item.nickname}</p>
                                <p>注册时间:{item.regTime}</p>
                                <p>邮箱:{item.email}</p>
                                <p>状态:<Switch></Switch></p>
                            </Card>
                        )
                    })
                }
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
                    <Form.Item label="用户名">
                         <Input value={form.username} onChange={this.formChange.bind(this, 'username')} />
                    </Form.Item>
                    <Form.Item label="密码">
                         <Input value={form.psword} onChange={this.formChange.bind(this, 'psword')} />
                    </Form.Item>
                    <Form.Item label="确认密码">
                         <Input value={form.tpasswd} onChange={this.formChange.bind(this, 'tpasswd')} />
                    </Form.Item>
                    <Form.Item label="真实名">
                         <Input value={form.nickname} onChange={this.formChange.bind(this, 'nickname')} />
                    </Form.Item>
                    <Form.Item label="邮箱">
                         <Input value={form.email} onChange={this.formChange.bind(this, 'email')} />
                    </Form.Item>
                </Form>
                </Modal>
            </div>
        );
    }
}

export default UserManage;