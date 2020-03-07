import React from 'react';
import {Icon, Row, Col, message} from 'antd';
import {Query} from 'react-apollo';
import {GET_ALL_SELLERS, GET_TOP_SELLERS} from '../../query';

const MIN_SELLERS = 3;

class FollowSellers extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selected: []
		}
		this.handleSellerClick = this.handleSellerClick.bind(this);
		this.setSelectedSellerBorder = this.setSelectedSellerBorder.bind(this);
		this.handleNext = this.handleNext.bind(this);
	}

	handleSellerClick(sellerID) {
        let selected = this.state.selected;

        if (!selected.includes(sellerID)) {
            selected.push(sellerID);
        } else {
            const index = selected.indexOf(sellerID);
            selected.splice(index, 1);
        }
		this.setState({selected: selected});
		this.props.onChange(this.state.selected);
	}

	setSelectedSellerBorder(sellerID) {
        let selected = this.state.selected;
		if (selected.includes(sellerID)) {
			return "solid 1px #00000059";
		} else {
			return "solid 1px #faeeeb"
        }
	}
	
	handleNext(e) {
		e.preventDefault();
		if (this.state.selected.length >= MIN_SELLERS) {
			this.props.onNext();
		} else {
			message.error(`Select ${MIN_SELLERS - this.state.selected.length} more shop(s)`)
		}
	}

    render() {
		return (
			<Query query={GET_TOP_SELLERS}>
			{
				({loading, data}) => {
					if (loading) {
						return <p>Loading...</p>
					}

					data = data.getTopSellers;
					console.log(data);
					
					return (
						<div className="form_content" style={{position:'relative'}}>
							<div className="container_40">
								<Icon onClick={e => this.handleNext(e)} type="right" theme="outlined" style={{left:'90%',position :'absolute',top:'45%',fontSize:'35px',fontWeight:'25px'}} />
								<h5>You have to follow atleast {MIN_SELLERS} shops to proceed <span style={{fontSize:'16px', color:'rgb(150,150,150)'}}>({this.state.selected.length} selected)</span></h5>
								<Row>
								{
									data.map(
										(seller, index) => {
											return (
												<Col xl={8} xm={12} xs={24} key={index}>
													<div 
														style={{margin: '5px',backgroundColor: 'white', border: this.setSelectedSellerBorder(seller.id)}}
														onClick={e => this.handleSellerClick(seller.id)}
													>
														<div 
															style={{ 
																background: `url(${seller.image})`, 
                                                                height: '220px',
                                                                backgroundRepeat: 'no-repeat',
																backgroundSize: 'contain',
                                                                backgroundPosition: 'center',
                                                                margin: '10px'
															}}
														></div>
														<div style={{padding: '10px', borderTop: 'solid 1px #faeeeb'}}>
															<h5 style={{fontWeight: 'bold'}}>{seller.name}</h5>
															<span>{seller.intro}</span>
															<p>({seller.followers.length} followers)</p>
														</div>
													</div>    
                                                </Col>
											)
										}
									)
								}
								</Row>								
								<Icon onClick={this.props.onPrev.bind(this)}type="left" theme="outlined" style={{right:'90%',position :'absolute',top:'45%',fontSize:'35px',fontWeight:'25px'}} />
							</div>
						</div>		 
					);
				}
			}
			</Query>
		);
    }
}

export default FollowSellers;