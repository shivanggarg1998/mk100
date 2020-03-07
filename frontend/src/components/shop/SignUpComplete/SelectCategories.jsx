import React from 'react';
import {Icon, Row, Col, message, Tag} from 'antd';
import {categories} from "../Header/categories";

const MIN_CATEGORIES = 3;
const { CheckableTag } = Tag;

class SelectCategories extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selected: []
		}
		this.handleSelection = this.handleSelection.bind(this);
		this.checkSelection = this.checkSelection.bind(this);
		this.handleNext = this.handleNext.bind(this);
	}

	handleSelection(category, title) {
        let selected = this.state.selected;

        let value = `${category}.${title}`;

        if (!selected.includes(value)) {
            selected.push(value);
        } else {
            const index = selected.indexOf(value);
            selected.splice(index, 1);
        }
		this.setState({selected: selected});
	}

	checkSelection(category, title) {
        let selected = this.state.selected;
        let value = `${category}.${title}`;

        return selected.includes(value);
	}
	
	handleNext(e) {
		e.preventDefault();
		if (this.state.selected.length >= MIN_CATEGORIES) {
            this.props.onChange(this.state.selected);
			this.props.onNext();
		} else {
			message.error(`Select ${MIN_CATEGORIES - this.state.selected.length} more shop(s)`)
		}
	}

    render() {
        return (
            <div className="form_content" style={{position:'relative'}}>
                <div className="container_40">
                    <Icon onClick={e => this.handleNext(e)} type="right" theme="outlined" style={{left:'90%',position :'absolute',top:'45%',fontSize:'35px',fontWeight:'25px'}} />
                    <h5>You have to select atleast {MIN_CATEGORIES} interests to proceed <span style={{fontSize:'16px', color:'rgb(150,150,150)'}}>({this.state.selected.length} selected)</span></h5>
                    {
                        categories.map(
                            (categ, index) => {
                                return (
                                    <div 
                                        key={index} 
                                        className="category_select"
                                        style={{margin: '40px 0'}}
                                    >
                                        <h5>{categ.name}</h5>
                                        {
                                            categ.items.map(
                                                (item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <CheckableTag
                                                                checked={this.checkSelection(categ.name, item)}
                                                                onChange={() => this.handleSelection(categ.name, item)}
                                                            >
                                                                {item}
                                                            </CheckableTag>
                                                        </div>
                                                    );
                                                }
                                            )
                                        }
                                    </div>
                                )
                            }
                        )
                    }
                    <Icon onClick={this.props.onPrev.bind(this)}type="left" theme="outlined" style={{right:'90%',position :'absolute',top:'45%',fontSize:'35px',fontWeight:'25px'}} />
                </div>
            </div>		 
		);
    }
}

export default SelectCategories;