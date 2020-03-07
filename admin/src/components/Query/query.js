import { gql } from 'apollo-boost';

export const REMOVE_PRODUCT = gql`
    mutation ($id: ID!) {
        removeProduct(productID: $id)
    }
`;

export const GET_SELLER = gql`
    query($input: String!) {
      Seller(shopName: $input) {
        name
        image
        id
        email
        mobile
        about
        intro
        shopName
        website
        address {
          address
          street
          city
          state
          zipcode
        }
        legal {
          gst
          gst_document
          aadhar
          aadhar_image_back
          aadhar_image_front
          pan
          pan_image
          cancelled_cheque
          bank {
            ifscCode
            name
            accountNumber
          }
        }
        policy {
          store
          return
        }
      }
    }

`;

export const GET_NOTIFICATION = gql`
query {
    getNotifsForAdmin {
      id
          to {
        id
      }
      action
      image
      text
    }
  }
`;

export const GET_ACTIVE_USER_BY_SELLER = gql`
{
  getActiveUsersLastWeekBySeller {
    users ,
    date
  }
}
`;

export const GET_REVENUE = gql`
{
  getRevenuePerWeekAdmin {
    date,
    sales
  }
}
`;

export const GET_REVENUE_MONTH = gql`
{
  getRevenuePerMonthAdmin {
    date ,
    sales
  }
}
`;

export const GET_PRODUCT_BY_ID = gql`
    query($input : ID!) {
        Product(id: $input) {
            id
            name
            image
            images
            price
            priceDistribution{
              base
              gst
              cod
              reverse
              shipping
            }
            sizes
            codAccepted
            returnAccepted
            description
            keywords
            seller {
                id
                name
                image
            }
        }
    }
`;


export const GET_PRODUCT = gql`
{
  getProductsPerWeekAdmin {
    date,
    products
  }
}
`;

export const GET_AUTH = gql `
    {
        auth @client {
            isAuthenticated ,
            user {
                id,
                name,
            }
        }
    }
`;

export const GET_LOGIN_STATUS = gql `
    {
        auth @client {
            isAuthenticated
        }
    }
`;

export const GET_ALL_USERS = gql`
    query {
        allUsers {
            id
            username
            name
            image
            about
            email
            following {
                id
            }
            followers {
                id
            }
            followingShop {
                id
            }
        }
    }
`;

export const GET_ALL_SELLERS = gql `
    query {
        allSellers {
            id
            shopName
            image
            name
            about
            email
            mobile
            approval{
                approved
                reviewed
                comment
            }
        }
    }
`;

export const GET_ALL_ORDERS = gql`
    query {
        allOrders {
            id
            user {
                name
                username
            }
            products {
                product {
                    id
                    name
                    image
                    description
                    seller {
                        id
                        shopName
                        name
                    }
                }
                itemCount
                selectedSize
            }
            discount
            total
            shipping {
                status
                address {
                    address
                    street
                    city
                    state
                    zipcode
                }
            }
            date
            status {
                packed
                shipped
                confirmed
                delivered
            }
            payment {
                status
                mode
            }
        }
    }
`;

export const GET_ALL_PRODUCTS = gql`
    query {
        allProducts {
            id
            name
            image
            description
            price
            sizes
            seller {
                name
                shopName
            }
        }
    }
`;

export const GET_APPROVAL_PRODUCTS = gql`
    query {
        getProductApproval{
            origin {
                id
                name
                price
                image
                seller {
                    name
                    shopName
                }
            }
            id
            approved
            approvalType
            reviewed
        }
    }
`;

export const GET_APPROVAL_SELELRS = gql`
query {
    getSellerApproval{
        origin {
            id
            name
            shopName
            image
            about
        }
        id
        approved
        approvalType
        reviewed
    }
}  
`;

export const HANDLE_APPROVAL = gql`
    mutation($id: ID!, $comment: String!, $approved: Boolean!) {
        handleApproval(
            input: {
                id: $id,
                comment: $comment,
                approved: $approved
            }
        )
    }
`;