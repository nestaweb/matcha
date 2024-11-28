export interface UserFriendsResponse {
	user_id: number;
	friend_id: number;
	added_at: Date;
}

export interface EnrichedFriendsResponse {
	user_id: string;
	friend_id: string;
	added_at: Date;
	firstName: string;
	lastName: string;
	gender: string;
}