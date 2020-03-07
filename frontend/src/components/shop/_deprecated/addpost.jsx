import React from "react";
import { Row, Col, Icon, Upload, Button, Input, message, Modal } from "antd";
import {Mutation} from 'react-apollo';
import {ADD_POST} from '../../query';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import {gql} from "apollo-boost";


// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: createUploadLink({uri:'http://localhost:4000'}),
// });


class addPost extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    fileList: [],
    showPreview:false,
    caption:'',
  };

  addNewPostSeller()
  {
    client.mutate({
      variables:{caption:this.state.caption,file :this.state.fileList[0].originFileObj},
      mutation:gql`
      mutation($caption:String!,$file:Upload!){
          addNewPostSeller(caption:$caption,file:$file)
        }`
    }).then(()=>{
      message.success('post added');
    })

  }

  handleCancel = () => this.setState({ previewVisible: false });
  previewOn(e)
  {
    let preview = !this.state.showPreview;
    this.setState({showPreview:preview});
  }
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };


  handleChange = ({ fileList }) => {
    console.log(fileList[0]);
    this.setState({ fileList })
    this.setState({
      previewImage:fileList[0].thumbUrl
    })
  };
  
  onTyping(e){
    this.setState({
      caption:e.target.value
    })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div
        style={{
          margin: "20px auto",
          border: "1px solid black",
          width: "40%",
          height: "200px",
          padding: "10px"
        }}
      >
        <Row>
          <Col span={6}>
            <Upload
              listType="picture-card"
              action={()=>{console.log('sone')}}
              fileList={fileList}
              data={this.upload}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.handleCancel}
            >
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
            <br></br>
            <Button onClick={(e) =>{this.previewOn(e)}} type="ghost">{this.state.showPreview ? 'Close Preview' : 'Show Preview' }</Button>
          </Col>
          <Col span={18}>
            <div style={{ position: "relative", height: "100%" }}>
              <Input.TextArea value={this.state.caption} onChange={(e)=>this.onTyping(e)} rows={8} placeholder="Add Post Here .... " />
              <Button
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px"
                }}
                type="primary"
                shape="circle"
                onClick={()=>this.addNewPostSeller()}
              >
                <i className="fa fa-send-o" />
              </Button>

            </div>
          </Col>
        </Row>
        { this.state.showPreview ? 
        <Row>
        <div className="photo" style={{backgroundColor:'white',margin:'30px auto 30px auto'}}>
                <header className="photo__header">
                    <img src="http://www.cloudsellerpro.com/wp-content/uploads/2017/01/avatar-3.png"
                         alt=''
                         className="photo__avatar"/>
                    <div className="photo__user-info">
                        <span className="photo__author">Seller 1</span>
                        <span className="photo__location"/>
                    </div>
                </header>
                <div className="photo__image" style={{backgroundImage: `url(${this.state.previewImage})`}}>
                </div>
                <h4 style={{textAlign:'center'}}>{this.state.caption}</h4>
                
                <div className="photo__info">
                    <div className="photo__actions">
                            <span className="photo__action">
                                <i className="fa fa-heart-o fa-lg"/>
                            </span>
                        <span className="photo__action">
                                <i className="fa fa-comment-o fa-lg"/>
                            </span>
                    </div>
                    <span className="photo__likes">45 likes</span>
                    <ul className="photo__comments">
                        <li className="photo__comment">
                            <span className="photo__comment-author">serranoarevalo</span> love this!
                        </li>
                        <li className="photo__comment">
                            <span className="photo__comment-author">serranoarevalo</span> love this!
                        </li>
                    </ul>
                    <span className="photo__time-ago">2 hours ago</span>
                    <div className="photo__add-comment-container">
                    <Input name="comment" placeholder="Add a comment..."/>
                       <Button type="primary" shape="circle" ><i class="fa fa-send-o"></i>
                          </Button>
                    </div>
                </div>
            </div>
        </Row> : ''
        }
      </div>
    );
  }
}

export default addPost;
