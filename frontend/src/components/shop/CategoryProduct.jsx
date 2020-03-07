import React from "react";
import {Link} from "react-router-dom";
import {Row, Col} from "antd";
import {Query} from "react-apollo";
import {ModalRoute} from "react-router-modal";
import Details from "./Product/Details";
import {gql} from "apollo-boost";

String.prototype.toSentenceCase = function() {
    let res = this.split("");
    res[0] = res[0].toUpperCase();
    for(let i=1; i<res.length; i++) {
        if (res[i] === " ") {
            res[i+1] = res[i+1].toUpperCase();
        }
    }
    res = res.join(""); 
    return res;
}

class CategoryProduct extends React.Component {
    
    componentWillMount() {
        console.log(this.props.match.params);
    }

    renderCount(query) {
        let count = 0;
        this.props.products.forEach(product => {
            if (product.description.toLowerCase().includes(query)) {
                count += 1;
            }
        });
        return (
            <span>
                <span>{count}</span> products found
            </span>
        );
    }

    render() {
        const name = this.props.match.params.name;
        const title = this.props.match.params.title;
        const {match} = this.props;

        const GET_PRODUCTS = gql`
            query {
                getProductsByCategory(
                    input: {
                        name:"${name}",
                        title:"${title}"
                    }
                ) {
                    id 
                    name
                    image
                }
            }
        `;
        return (
            <div className=" bg-grey">
                <div className="container">
                    <div className="container_40">
                        <Row className="search-result">
                            <Col span={18} className="search-result__text">
                                <h1><strong>{name.toSentenceCase()}</strong> / {title.toSentenceCase()}</h1>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col span={24}>
                            <Query query={GET_PRODUCTS}>
                                {({loading, error, data}) => {
                                    console.log(loading, error, data);
                                    if (loading) return <p>Loading...</p>;
                                    if (error) return <p>Error :(</p>;

                                    data = data.getProductsByCategory;
                                    return (
                                        <div>
                                            <div className="container_40">
                                                <div className="products">
                                                    {data.length > 0 ? (data.map((product, index) => (
                                                        <div key={index} className={"product"}>
                                                            <div className="image-container">
                                                                <Link to={`${match.url}/${product.id}`}>
                                                                    <img
                                                                        className="img_fluid" // each_product
                                                                        alt={product.description}
                                                                        key={index}
                                                                        src={`${product.image}`}
                                                                    />
                                                                </Link>
                                                                {product.name}
                                                            </div>
                                                        </div>
                                                    ))) : 
                                                    <p>No products</p>
                                                }
                                                </div>
                                            </div>
                                            {/*<ModalRoute path={`${match.url}/product/:id`} component={Details}/>*/}
                                            <ModalRoute
                                                path={`${match.url}/:id`}
                                                parentPath={match.url}
                                                component={Details}
                                                modalClassName={"react-router-modal__modal container"}
                                            />
                                        </div>
                                    );
                                }}
                            </Query>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default CategoryProduct;
