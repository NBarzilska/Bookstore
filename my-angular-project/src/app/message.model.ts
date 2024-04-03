export interface Message {
    _id?: string;
    sender: string;
    receiver: string;
    book_id: string;
    message: string;
    date: Date | string; 
    seen: boolean;
    senderUsername?: string;
    receiverUsername?: string;
}
