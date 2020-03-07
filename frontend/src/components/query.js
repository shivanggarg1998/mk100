import {gql} from "apollo-boost";

export const CHECK_PINCODE = gql`
    query($zip: Int) {
        checkCoverage(pincode: $zip)
    }
`;

export const CHANGE_VISBILITY = gql`
    mutation ChangeVisibility($val: Boolean){
        changeProfileVisibility(public: $val)
    }
`;

export const SEARCH_USERS = gql`
    query($input : String!){
      searchUsers(query : $input){
        name ,
        username ,
        id 
      }
    }
`;

export const GET_ORDER_BY_ID = gql`
    query($input : ID!) {
        Order(id : $input) {
            user {
                id
                name
            }
            products {
                product {
                    id
                    name
                    price
                    image
                    description
                    sizes
                    seller {
                        id
                        name
                        image
                    }
                }
                itemCount
                selectedSize
            }
            discount
            total
            id
            order_number
            shipping {
                address {
                    address
                    street
                    city
                    state
                    zipcode
                }
                status
            }
            status {
                confirmed
                packed
                shipped
                delivered
            }
            payment {
                mode
                status
            }
        }    
    }
`;

export const GET_ORDER_BY_NUMBER = gql`
    query($input : ID!) {
        getOrderByNumber(order_number : $input) {
            user {
                id
                name
            }
            products {
                product {
                    id
                    name
                    price
                    image
                    description
                    sizes
                    seller {
                        id
                        name
                        image
                    }
                }
                itemCount
                selectedSize
                _id
            }
            discount
            total
            id
            order_number
            shipping {
                address {
                    address
                    street
                    city
                    state
                    zipcode
                }
                status
            }
            status {
                confirmed
                packed
                shipped
                delivered
            }
            payment {
                mode
                status
            }
        }    
    }
`;

export const GET_ORDER_BY_USER = gql`
    query {
        getOrdersByUser {
            user {
                id
                name
            }
            products {
                product {
                    id
                    name
                    price
                    image
                    description
                    sizes
                    seller {
                        id
                        name
                        image
                    }
                }
                status {
                    confirmed
                    shipped
                    delivered
                }
                itemCount
                selectedSize
                _id
            }
            discount
            total
            id
            date
            order_number
            shipping {
                address {
                    address
                    street
                    city
                    state
                    zipcode
                }
                status
            }
            status {
                confirmed
                packed
                shipped
                delivered
            }
            payment {
                mode
                status
            }
        }
    }
`;


export const GET_ENC_REQUEST = gql`
    mutation($orderID : ID) {
        getEncryptedRequest(orderID: $orderID) {
            encRequest ,
            access_code
        }
    }
`;
export const GET_ALL_USERS = gql`
    query {
        allUsers {
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

export const GET_USER_ADDRESS = gql`
    {
        getUserAddresses {
            address
            zipcode
            state
            street
            city
        }
    }
`;

export const GET_CART = gql`
    {
        getCart {
            id
            items {
                itemCount
                selectedSize
                item {
                    id
                    name
                    price
                    image
                    description
                    seller {
                        id ,
                        image ,
                        name
                    }
                }
            }
        }
    }
`;


export const ADD_ORDER_CART = gql`
mutation($input : AddOrderFromCartInput) {
  addOrderFromCart(input : $input) {
    order {
        id
        order_number
        discount
        total
        shipping {
          status
          address {
            address
            street
            state
            city
            zipcode
          }
        }
        status {
          confirmed
          packed
          shipped
          delivered
        }
        products {
          product {
            id
            name
            price
            seller {
              id
              name
              image
            }
          } ,
          itemCount ,
          selectedSize
        }
    }
  }
}`;


export const GET_USER_FEED = gql`
    {
        getFeed {
            id ,
            refString ,
            origin {
                ...on UserPost {
                    id,
                    caption ,              
                    product {
                        id
                        name ,
                        image ,
                        in_my_wishlist ,
                        seller {
                            id  
                            name 
                        }
                    }
                    user {
                        id
                        name ,
                        username ,
                        image
                    }
                    comments {
                        id ,
                        text , 
                        username
                    }
                    
                }
                ...on Sellerpost {
                    id,
                    caption ,
                    image ,
                    likes ,
                    liked_by_me ,
                    seller {
                        id
                        name ,
                        shopName ,
                        image
                    } ,
                    comments {
                        id ,
                        text , 
                        username
                    }
                }
                ...on Product {
                    id
                    name ,
                    image ,
                    sizes ,
                    price,
                    in_my_wishlist,
                    description ,
                    codAccepted ,
                    returnAccepted
                    seller {
                        id
                        name ,
                        image
                    }
                }
            },
            created_at ,
            updated_at ,
            event

        }
    }
`;

export const USER_SIGNUP = gql`
    mutation($input : AuthInput , $details : UserDetailsInput , $address : AddressInput ) {
        UserSignup(input : $input , details :$details , address :$address  ) {
            token {
                code ,
                content
            }
        }
    }
`;


export const GET_AUTH = gql`
    {
        auth @client {
            isAuthenticated ,
            user {
                id ,
                name ,
                username,
            }
        }
    }
`;

export const GET_LOGIN_STATUS = gql`
    {
        auth @client {
            isAuthenticated
        }
    }
`;

export const SET_AUTH = gql`
    mutation setAuth {
        updateAuth @client
    }

`;
export const FOLLOW_USER = gql`
mutation followuser($FollowingID: ID!) {
  followUser( FollowingID: $FollowingID) {
    id
    name
  }
}
`;
export const UNFOLLOW_USER = gql`
mutation unfollowuser($FollowingID: ID!) {
  unFollowUser( FollowingID: $FollowingID) {
    id
    name
  }
}
`;
export const FOLLOW_SHOP = gql`
mutation followshop($FollowingID: ID!) {
  followShop( FollowingID: $FollowingID) {
    id
    name
  }
}
`;
export const UNFOLLOW_SHOP = gql`
mutation unfollowshop($FollowingID: ID!) {
  unFollowShop( FollowingID: $FollowingID) {
    id
    name
  }
}
`;
export const GET_USER = gql`
query user($username : String!) {
    User(username : $username){
        id
        name
        about
        image
        username
        email
        public
        following{
            id
            username
            image
            about
            name
          followingShop{
            id
            shopName
            image
            about
          }
        }
        followers {
            id
            username
            image
            about
        }
        followingShop {
            id
            shopName
            image
            about
        }
    }
}
`;

export const UPDATE_USER = gql`
    mutation($input: UserDetailsInput) {
        updateUser(input: $input) {
            id
        }
    }
`;

export const GET_SEARCH_USER_SELLER = gql`
query($input : String!){
  searchUsersAndSellers(query : $input) {
    sellers {
      id
      name 
      shopName 
      image
    } 
    users {
      id
      name
      username
      image
    }
  }
}
`;

export const GET_POST = gql`
    query post($username : String!) {
        UserPosts(username : $username) {
            id
            caption
            product {
              id
              name
              image
              description
              keywords
              seller {
                id
                name
              }
            }
            user {
              username
            }
        }
    }
`;

export const GET_SELLER = gql`
    query getSeller($shopName: String!) {
        Seller (shopName: $shopName) {
            name
            image
            id
            about
            intro
            shopName
            address {
                address
                street
                city
                state
                zipcode
            }
            policy {
                store
                return
            }
            followers{
                id
              }
        }
    }
`;

export const GET_PRODUCT = gql`
    query($input : ID!) {
        Product(id: $input) {
            id
            name
            image
            images
            price
            sizes
            codAccepted
            returnAccepted
            description
            keywords
            seller {
                id
                name
                image
                about
                policy {
                    store
                    return
                }
            }
        }
    }
`;

export const GET_PRODUCTS_BY_SELLER = gql`
    query getProductsBySeller($id: ID!) {
        getProductBySeller(id: $id) {
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

export const REMOVE_FROM_WISHLIST = gql`
    mutation remove($id: ID) {
        removeFromWishlist(product: $id) {
            id
        }
    }
`;

export const ADD_TO_WISHLIST = gql`
    mutation add($id: ID) {
        addToWishlist(product: $id) {
            id
        }
    }
`;

export const GET_FOLLOW_SELLER = gql`
    query ($ids: [ID]!){
        getSellers (ids:$ids) {
            id
            name
            image
            about
            shopName
        }
    }
`;

export const GET_POST_BY_SELLER = gql`
    query sellerpost($id : ID){
        getSellerPostBySeller(id:$id){
            id
            image
            caption
            seller {
                id
                name
                image
            }
            comments{
                id
                username
                text
            }
        }
    }

`;

export const ADD_SELLER_COMMENT = gql`
    mutation($input : addCommentInput){
        addSellerComment(input : $input){
            id ,
            comments {
                id ,
                text ,
                username
            }
        }
    }
`;

export const ADD_SELLER_POST_LIKE = gql`
    mutation($input : addLikeInput) {
      addSellerPostLike(input : $input){
        liked_by_me ,
        id ,
        likes
      }
    }
`;
export const REMOVE_SELLER_POST_LIKE = gql`
    mutation($input : removeLikeInput) {
      removeSellerPostLike(input : $input){
        liked_by_me ,
        likes ,
        id ,
      }
    }
`;
export const ADD_USER_POST_COMMENT = gql`
    mutation($input : addCommentInput){
        addUserPostComment(input : $input){
            id ,
            comments {
                id ,
                text ,
                username
            }
        }
    }
`;

// export const ADD_USER_POST_LIKE = gql`
//     mutation($input : addLikeInput) {
//       addUserPostLike(input : $input){
//         liked_by_me ,
//         id ,
//         likes
//       }
//     }
// `
// export const REMOVE_USER_POST_LIKE = gql`
//     mutation($input : removeLikeInput) {
//       removeUserPostLike(input : $input){
//         liked_by_me ,
//         likes ,
//         id ,
//       }
//     }
// `


export const GET_ALL_SELLERS = gql`
    query {
        allSellers{
            id
            name
            intro
            about
            image
            shopName
        }
    }
`;

export const GET_TOP_SELLERS = gql`
    query {
        getTopSellers{
            id
            name
            intro
            about
            image
            shopName
            followers {
                id
            }
        }
    }
`;

export const FB_SIGNUP = gql`
    mutation($input: FBInput) {
        fbSignup(input: $input) {
            token {
                code
                content
            }
        }
    }
`;

export const FB_SIGNIN = gql`
    mutation($input: FBInput) {
        fbSignin(input: $input) {
            token {
                code
                content
            }
        }
    }
`;

export const GET_USER_NOTIFS = gql`
    query {
        getNotifsByUser {
            id
            image
            text
            action
            to {
                name
                username
            }
            readBy {
                id
                name
                username
            }
        }
    }
`;
export const ADD_POST = gql`
mutation($file:Upload!){
    addNewPostSeller(file:$file)
  }`;


export const ADD_PRODUCT_REPOST = gql`
mutation($input : AddUserPostInput) {
  addUserPost(input : $input ) {
    id
  }
}
`;

export const GET_FEED_ITEM = gql`
query ($input : ID!){
    getFeedItem(id :$input) {
        id ,
        refString ,
        origin {
            ...on UserPost {
                id,
                caption ,              
                product {
                    id
                    name ,
                    image ,
                    in_my_wishlist ,
                    seller {
                        name 
                    }
                }
                user {
                    id
                    name ,
                    username ,
                    image
                }
                comments {
                    id ,
                    text , 
                    username
                }
                
            }
            ...on Sellerpost {
                id,
                caption ,
                image ,
                likes ,
                liked_by_me ,
                seller {
                    name ,
                    shopName ,
                    image
                } ,
                comments {
                    id ,
                    text , 
                    username
                }
            }
            ...on Product {
                id
                name ,
                image ,
                sizes ,
                price,
                in_my_wishlist,
                description ,
                codAccepted ,
                returnAccepted
                seller {
                    name ,
                    image
                }
            }
        },
        created_at ,
        updated_at ,
        event
    }
}`;

export const UPDATE_POST_CAPTION = gql`
    mutation updateCaption($input: UpdateUserPost) {
        updateUserPost(
            input: $input
        ) {
            id
            caption
        }
    }
`;

export const DELETE_USER_POST = gql`
    mutation deletePost($id: ID!) {
        deleteUserPost(postID: $id)
    }
`;


export const LOGIN_MUTATION = gql`
    mutation Login($input: AuthInput) {
        UserLogin(input: $input) {
            token {
                code
                content
            }
        }
    }
`;

export const GET_SELLER_POSTS_BY_FEED = gql`
    query($id: ID!) {
      getSellerPostByFeed(id: $id) {
        id
        refString
        origin {
          ... on UserPost {
            id
            caption
            product {
              id
              name
              image
              in_my_wishlist
              seller {
                name
              }
            }
            user {
              id
              name
              username
              image
            }
            comments {
              id
              text
              username
            }
          }
          ... on Sellerpost {
            id
            caption
            image
            likes
            liked_by_me
            seller {
              name
              shopName
              image
            }
            comments {
              id
              text
              username
            }
          }
          ... on Product {
            id
            name
            image
            sizes
            price
            in_my_wishlist
            description
            codAccepted
            returnAccepted
            seller {
              name
              image
            }
          }
        }
        created_at
        updated_at
        event
      }
    }

`;

export const GET_WISHLIST = gql`
    query($user : ID) {
        showWishlist(user : $user) {
            user {
                name
                username
                id
            }
            products {
                id
                name
                image
                price
                description
                seller {
                    id
                    name
                    image
                    about
                }
            }
        }
    }
`;

export const REMOVE_FROM_CART = gql`
    mutation($index : Int)
    {
        removeFromCart(
            input: {
                index: $index
            }
        ) {
            id
            items {
                item {
                    id
                    name
                }
                selectedSize
                itemCount
            }
        }
    }
`;