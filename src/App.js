import React from 'react';
import './App.css';
import {Button,Layout, Menu, Icon} from 'antd';
import {Link,HashRouter,Switch,Route,Redirect} from 'react-router-dom';
import Index from './pages/Index';
import Article from './pages/ArticleManage';
import Category from './pages/CategoryManage';
import User from './pages/UserManage';



const { Header, Sider, Content } = Layout;
class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

    toggle = () => {
      this.setState({
        collapsed: !this.state.collapsed,
      });
    };
   render(){
    return (
      <HashRouter>
        <Layout style={{minHeight:'100vh'}} id="layout">
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">   
                <Link to="/index">
                  <Icon type="user" />
                  <span>首页</span>
                </Link>
              </Menu.Item>
             
              
              
              <Menu.Item key="2">
                <Link to="/article">
                  <Icon type="video-camera" />
                  <span>咨询管理</span>
                </Link>
              </Menu.Item>
              

             
              <Menu.Item key="3">
                <Link to="/category">
                  <Icon type="upload" />
                  <span>栏目管理</span>
                </Link>
              </Menu.Item>

              
              <Menu.Item key="4">
                <Link to="/user">
                  <Icon type="upload" />
                  <span>用户管理</span>
                </Link>
              </Menu.Item>
              
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            </Header>
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                background: '#fff',
                minHeight: 280,
              }}
            >
             <Switch>
               <Route path="/index" component={Index}></Route>
               <Route path="/article" component={Article}></Route>
               <Route path="/category" component={Category}></Route>
               <Route path="/user" component={User}></Route>
             </Switch>
            </Content>
          </Layout>
        </Layout>
      </HashRouter>
     );
   }
  
}

export default App;
