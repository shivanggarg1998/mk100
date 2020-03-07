import React from "react";
import {Link} from "react-router-dom";
import {ModalRoute} from "react-router-modal";
import Details from "../Product/Details";
import gql from "graphql-tag";
import {Query} from "react-apollo";
// import {GET_AUTH, GET_USER, GET_PRODUCTS_BY_SELLER} from "../../query";

// const GET_PRODUCTS = gql`
//     {
//         allProducts {
//             id
//             name
//             image
//         }
//     }
// `;

const GET_FEED_PRODUTS = gql`
    {
        getFeedProducts {
            id
            name
            image
            sizes
            keywords
            description
            seller {
                id
                name
            }
        }
    }
`;

class Home extends React.Component {
    render() {
        const {match} = this.props;
        // console.log(ModalRoute);
        return (

            <Query
                query={GET_FEED_PRODUTS}
            >
                {({loading, error, data}) => {
                    console.log("Data GET FEED PRODUCTS : ", data);
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;

                    return (
                        <div>
                            <div className="container_40">

                                <div className="products">
                                    {data.getFeedProducts.map((product, index) => (
                                        <div key={index} className={"product"}>
                                            <div className="image-container">
                                                <Link to={match.url + "/" + product.id}>
                                                    <img
                                                        className="img_fluid" // each_product
                                                        alt={product.description}
                                                        key={index}
                                                        src={`product_images/${
                                                            product.image
                                                            }`}
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                {/*<ModalRoute path={`${match.url}/product/:id`} component={Details}/>*/}
                                <ModalRoute
                                    path={`${match.url}/:id`}
                                    parentPath={match.url}
                                    component={Details}
                                />
                            </div>
                        </div>
                    );
                }}
            </Query>

        );
    }
}

//
// function mapStateToProps(state) {
//     return {
//         products: state.products
//     };
// }
//
// const HomeContainer = connect(mapStateToProps, {
//     getProducts
// })(Home);

export default Home;
