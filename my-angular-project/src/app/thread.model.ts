export interface CommunicationThread {
    _id: string; // book ID
    bookTitle: string;
    owner: string;
    otherParty: string; // User ID of the other party
    lastMessage: string; // Last message in the thread
    otherPartyUsername:string;
  }
  