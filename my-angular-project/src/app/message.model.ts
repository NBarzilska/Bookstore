export interface Message {
    _id?: string; // Assuming your database generates an ID
    sender: string;
    receiver: string;
    book_id: string;
    message: string;
    date: Date | string; // Depending on how you handle dates
    seen: boolean;
    senderUsername?: string;
    receiverUsername?: string;
}
