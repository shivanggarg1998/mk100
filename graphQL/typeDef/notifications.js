import { gql } from 'apollo-server';

export default gql`
    extend type Query {
        allNotifs: [Notification]
        getNotifsByUser: [Notification]
        getNotificationsBySeller: [Notification]
        getNotifsForAdmin: [Notification]
    }

    extend type Mutation {
        notificationRead(id: ID): Notification
        makeChatNotify(to:String):Boolean
        makeChatNotifyToSeller(to:String):Boolean
        makeChatNotifyFromSeller(to:String):Boolean
    }
`;