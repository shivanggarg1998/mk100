import React from "react";
import {Link} from "react-router-dom";
import {Row, Col} from "antd";
import {Query} from "react-apollo";
import {ModalRoute} from "react-router-modal";
import Details from "./Product/Details";
import {gql} from "apollo-boost";

class Search extends React.Component {
    //
    // componentDidMount() {
    //     this.props.getProducts();
    // }

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
        const query = this.props.match.params.query.trim().toLowerCase();
        const {match} = this.props;
        const GET_PRODUCTS = gql`{
            getProducts(filter: "${query}") {
                id
                name
                image
            }
        }
        `;
        return (
            <div className=" bg-grey">
                <div className="container">
                    <div className="">
                        <Row className="search-result">
                            <Col span={6}>
                                <div className="search-result__image">
                                    <img
                                        className=""
                                        alt=''
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV9e0xcioHeH_3D7blQUumfnZQEgdveoWYdhEtP8qgGEN_xSxf"
                                    />
                                </div>
                            </Col>
                            <Col span={18} className="search-result__text">
                                <h1>#{query}</h1>
                                {/*{this.renderCount(query)}*/}
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

                                    return (
                                        <div>
                                            <Row className="container_40">
                                                <div className="products">
                                                {data.getProducts.map((product, index) => (
                                                        <div key={index} className={"product"}>
                                                            <div className="image-container">
                                                                <Link to={match.url + "/" + product.id}>
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
                                                    ))}{data.getProducts.map((product, index) => (
                                                        <div key={index} className={"product"}>
                                                            <div className="image-container">
                                                                <Link to={match.url + "/" + product.id}>
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
                                                    ))}{data.getProducts.map((product, index) => (
                                                        <div key={index} className={"product"}>
                                                            <div className="image-container">
                                                                <Link to={match.url + "/" + product.id}>
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
                                                    ))}
                                                </div>
                                            </Row>
                                            {/*<ModalRoute path={`${match.url}/product/:id`} component={Details}/>*/}
                                            <ModalRoute
                                                path={`${match.url}/:id`}
                                                parentPath={match.url}
                                                component={Details}
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

export default Search;
