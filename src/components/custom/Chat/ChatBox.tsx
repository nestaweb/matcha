'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from "@/hooks/useSocket";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Image as ImageIcon } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "@/ui/input";
import { CryptoService } from '@/server/CryptoService';
import { toast } from "sonner";

interface ChatBoxProps {
	userId: string;
	receiverId: string;
}

interface IMessage {
	id: number;
	senderId: string;
	receiverId: string;
	room_id: string;
	message: string;
	sentAt: Date;
	is_read: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ userId, receiverId }) => {
	const socket = useSocket("http://localhost:4001");
	// const socket = useSocket("https://outgoing-ghoul-open.ngrok-free.app");
	const [messages, setMessages] = useState<IMessage[]>([]);
 	const [newMessage, setNewMessage] = useState("");
	const [chatRoomId, setChatRoomId] = useState("");
	const cryptoService = new CryptoService(process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);

	useEffect(() => {
		console.log(chatRoomId);
	}, [chatRoomId]);

	useEffect(() => {
		console.log(messages);
	}, [messages]);

	useEffect(() => {
		if (!userId || !receiverId) return;
		fetch("/api/messages/getChatRoom", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ senderId: userId, receiverId }),
		})
		.then(async (response) => {
			if (response.status === 200) {
				const data = await response.json();
				setChatRoomId(data);
			}
		});
	}, [userId, receiverId]);

	useEffect(() => {
		if (socket && chatRoomId && userId) {
			socket.emit("joinRoom", chatRoomId);
		
			const handleReceiveMessage = (messageData: any) => {
				console.log("Received message data:", messageData);
				
				if (!userId || !messageData.senderId || !messageData.receiverId) return;
				if (userId === undefined || messageData.senderId === undefined || messageData.receiverId === undefined) return;

				const cryptedSenderId = messageData.senderId.split('.');
				const cryptedKeySenderId = { encryptedText: cryptedSenderId[0], iv: cryptedSenderId[1] };
				const cryptedReceiverId = messageData.receiverId.split('.');
				const cryptedKeyReceiverId = { encryptedText: cryptedReceiverId[0], iv: cryptedReceiverId[1] };
				const decryptedSenderId = parseInt(cryptoService.decrypt(cryptedKeySenderId));
				const decryptedReceiverId = parseInt(cryptoService.decrypt(cryptedKeyReceiverId));
				const cryptedUserId = userId.split('.');
				const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };
				const decryptedUserId = parseInt(cryptoService.decrypt(cryptedKeyUserId));

				if (decryptedSenderId !== decryptedUserId && chatRoomId === messageData.room_id) {
					setMessages((prev) => {
						const isDuplicate = prev.some((msg) => msg.id === messageData.id);
						return isDuplicate ? prev : [...prev, messageData];
					});
					setMessages((prev) => prev.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()));
				}
			};

			socket.on("receiveMessage", handleReceiveMessage);

			console.log("Fetching previous messages ...");
			console.log("Chat room ID:", chatRoomId);

			const fetchPreviousMessages = async () => {
				console.log("Fetching previous messages ...");
				try {
					const response = await fetch("/api/messages/getRoomMessages", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ 
							chatRoomId: chatRoomId,
						}),
					});
		  
					if (response.ok) {
						const messages = await response.json();
						console.log("Previous messages:", messages);
						setMessages((prev) => {
							const isDuplicate = prev.some((prevMsg) => messages.some((msg: any) => msg.id === prevMsg.id));
							return isDuplicate ? prev : [...prev, ...messages.map((msg: any) => msg)];
						});
						setMessages((prev) => prev.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()));
					}
				} catch (error) {
					console.error("Failed to fetch previous messages:", error);
				}
			};
		  
			fetchPreviousMessages();

			return () => {
				socket.off("receiveMessage", handleReceiveMessage);
			};
		}
	}, [socket, chatRoomId, userId]);

	useEffect(() => {
		if (socket && chatRoomId) {
			const handleReadReceipt = ({ messageIds }: { messageIds: number[] }) => {
				setMessages((prevMessages) =>
					prevMessages.map((msg) =>
						messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
					)
				);
				setMessages((prev) => prev.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()));
			};
	
			socket.on("messageRead", handleReadReceipt);
	
			return () => {
				socket.off("messageRead", handleReadReceipt);
			};
		}
	}, [socket, chatRoomId]);

	useEffect(() => {
		if (socket && chatRoomId) {
			const unreadMessageIds = messages
				.filter((msg) => !msg.is_read)
				.map((msg) => msg.id);
	
			if (unreadMessageIds.length > 0) {
				socket.emit("messageRead", { chatRoomId, messageIds: unreadMessageIds });
			}
		}
	}, [socket, chatRoomId]);

	useEffect(() => {
		if (socket && chatRoomId) {
			const handleNewMessage = async (messageData: IMessage) => {
				if (messageData.room_id !== chatRoomId) {
					await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/getUserFirstName`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({encryptedUserId: messageData.senderId}),
					})
					.then(async (response) => {
				
						if (response.status === 200) {
							const data = await response.json();
							const shortMessage = messageData.message.length > 30 ? `${messageData.message.slice(0, 30)}...` : messageData.message;
							toast.message('New message from ' + data, {
								description: shortMessage,
							});
						}
					})
				} else {
					setMessages((prev) => {
						const isDuplicate = prev.some((msg) => msg.id === messageData.id);
						return isDuplicate ? prev : [...prev, messageData];
					});
					setMessages((prev) => prev.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()));
				}
			};
	
			socket.on("newMessage", handleNewMessage);
	
			return () => {
				socket.off("newMessage", handleNewMessage);
			};
		}
	}, [socket, chatRoomId]);

	const sendMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter" || !newMessage.trim()) return;
		if (!userId || !receiverId || !chatRoomId) return;

		try {
			const messageData = {
				id: -1,
				senderId: userId,
				receiverId,
				room_id: chatRoomId,
				message: newMessage,
				sentAt: new Date(),
				is_read: false,
			};
		
			if (!socket) {
				console.error('Socket not connected');
				return;
			}

			console.log("Sending message data:", messageData);
		  		  
			await fetch("/api/messages/sendMessage", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(messageData),
			})
			.then(async (response) => {
				if (response.status === 200) {
					const data = await response.json();
					console.log('Message sent:', data);
					messageData.id = data.id;
					socket.emit("sendMessage", messageData);
				}
			});
		  
			setMessages((prev) => {
				const isDuplicate = prev.some((msg) => msg.id === messageData.id);
				return isDuplicate ? prev : [...prev, messageData];
			});
			setMessages((prev) => prev.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()));
			setNewMessage("");
			
		  } catch (error) {
			console.error('Message sending failed:', error);
		}
	};

	return (
		<>
		<ScrollArea className="flex flex-col-reverse p-8 h-9/12 overflow-y-auto">
			<div className="w-full flex flex-col gap-4">
				{messages.map((msg, idx) => {
					if (!userId || !msg.senderId || !msg.receiverId) return;
					if (userId === undefined || msg.senderId === undefined || msg.receiverId === undefined) return;
					if (chatRoomId !== msg.room_id) return ;
					const cryptedSenderId = msg.senderId.split('.');
					const cryptedKeySenderId = { encryptedText: cryptedSenderId[0], iv: cryptedSenderId[1] };
					const cryptedReceiverId = msg.receiverId.split('.');
					const cryptedKeyReceiverId = { encryptedText: cryptedReceiverId[0], iv: cryptedReceiverId[1] };
					const decryptedSenderId = parseInt(cryptoService.decrypt(cryptedKeySenderId));
					const decryptedReceiverId = parseInt(cryptoService.decrypt(cryptedKeyReceiverId));
					const cryptedUserId = userId.split('.');
					const cryptedKeyUserId = { encryptedText: cryptedUserId[0], iv: cryptedUserId[1] };
					const decryptedUserId = parseInt(cryptoService.decrypt(cryptedKeyUserId));
					return (
						decryptedSenderId === decryptedUserId ?
						<div key={idx} className="flex items-end flex-row-reverse gap-2 w-2/3 ml-auto">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="bg-foreground/90 text-primary p-4 rounded-2xl rounded-br-none flex flex-col gap-1">
								<p>
									{msg.message}
								</p>
								<p className="w-full flex justify-end text-sm text-primary/60">{
									new Date(msg.sentAt).toLocaleTimeString('fr-FR', {
										hour: '2-digit',
										minute: '2-digit',
									})
								}</p>
							</div>
						</div>
						:
						<div key={idx} className="flex items-end gap-2 w-2/3">
							<Avatar>
								<AvatarImage src="https://images.freeimages.com/images/large-previews/971/basic-shape-avatar-1632968.jpg?fmt=webp&h=350" alt="@shadcn" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="bg-foreground/10 p-4 rounded-2xl rounded-bl-none flex flex-col gap-1">
								<p>
									{msg.message}
								</p>
								<p className="w-full flex justify-end text-sm text-foreground/60">{
									new Date(msg.sentAt).toLocaleTimeString('fr-FR', {
										hour: '2-digit',
										minute: '2-digit',
									})
								}
								</p>
							</div>
						</div>
					)
				})}
				
			</div>
			</ScrollArea>
			<div className="flex p-8 py-5 gap-4">
				<div className="transition duration-300 cursor-pointer ease-in-out hover:bg-foreground/5 flex items-center justify-center p-2 rounded-2xl">
					<ImageIcon />
				</div>
				<Input 
					className="transition duration-300 ease-in-out py-5 px-4 rounded-2xl border-foreground/10 border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground/70"
					placeholder="Type a message ..."
					value={newMessage}
        			onChange={(e) => setNewMessage(e.target.value)}
					onKeyDown={(e) => sendMessage(e)}
				/>
			</div>
		</>
	);
};

export default ChatBox;