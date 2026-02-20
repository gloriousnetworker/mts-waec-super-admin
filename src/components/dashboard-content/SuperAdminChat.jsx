'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSuperAdminAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const chatContainer = "fixed bottom-6 right-6 z-50";
const chatWindow = "absolute bottom-20 right-0 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden";
const chatHeader = "bg-[#7C3AED] text-white p-4 flex justify-between items-center";
const chatHeaderTitle = "text-[16px] leading-[100%] font-[600] font-playfair";
const chatHeaderClose = "text-white hover:text-gray-200 cursor-pointer text-xl";
const chatMessages = "h-96 overflow-y-auto p-4 space-y-4";
const chatMessage = "flex flex-col";
const chatMessageSent = "items-end";
const chatMessageReceived = "items-start";
const chatBubble = "max-w-[80%] p-3 rounded-lg text-[13px] leading-[140%] font-[500] font-playfair";
const chatBubbleSent = "bg-[#7C3AED] text-white rounded-br-none";
const chatBubbleReceived = "bg-gray-100 text-[#1E1E1E] rounded-bl-none";
const chatTime = "text-[9px] leading-[100%] font-[400] text-[#9CA3AF] mt-1 font-playfair";
const chatInput = "border-t border-gray-200 p-4 flex gap-2";
const chatInputField = "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#7C3AED] text-[13px] font-playfair";
const chatSendButton = "px-4 py-2 bg-[#7C3AED] text-white rounded-md hover:bg-[#6D28D9] transition-colors font-playfair text-[13px] leading-[100%] font-[600]";
const chatDisabledInput = "flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-400 text-[13px] font-playfair cursor-not-allowed";

export default function SuperAdminChat({ isOpen, onClose, initialTicketId = null }) {
  const { user } = useSuperAdminAuth();
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [view, setView] = useState('list');
  const [chatsLoaded, setChatsLoaded] = useState(false);

  useEffect(() => {
    const storedChats = localStorage.getItem('super_admin_chats');
    if (storedChats) {
      setActiveChats(JSON.parse(storedChats));
    } else {
      const demoChats = [
        {
          id: 'CHAT001',
          ticketId: 'TKT001',
          adminName: 'Dr. Michael Adebayo',
          adminEmail: 'michael.adebayo@ksce.edu.ng',
          school: 'Kogi State College of Education',
          schoolId: 'SCH001',
          subject: 'Cannot add new students - Student ID error',
          lastMessage: 'Need help with student registration',
          lastMessageTime: new Date(Date.now() - 1800000).toISOString(),
          unread: 2,
          status: 'active',
          messages: [
            { id: 1, sender: 'admin', senderName: 'Dr. Michael Adebayo', text: 'Hello, I am having trouble adding new students to the system.', timestamp: new Date(Date.now() - 7200000).toISOString() },
            { id: 2, sender: 'admin', senderName: 'Dr. Michael Adebayo', text: 'The form keeps throwing an error when I try to submit.', timestamp: new Date(Date.now() - 7100000).toISOString() },
            { id: 3, sender: 'support', senderName: 'Support Team', text: 'I understand your issue. Can you share a screenshot of the error?', timestamp: new Date(Date.now() - 7000000).toISOString() },
            { id: 4, sender: 'admin', senderName: 'Dr. Michael Adebayo', text: 'Here is the screenshot. It says "Student ID already exists" even for new students.', timestamp: new Date(Date.now() - 6900000).toISOString() }
          ]
        },
        {
          id: 'CHAT002',
          ticketId: 'TKT002',
          adminName: 'Mrs. Sarah Ochefu',
          adminEmail: 'sarah.ochefu@gssokoja.edu.ng',
          school: 'Government Secondary School, Lokoja',
          schoolId: 'SCH002',
          subject: 'Student results not showing in dashboard',
          lastMessage: 'Exam results not displaying correctly',
          lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
          unread: 1,
          status: 'active',
          messages: [
            { id: 1, sender: 'admin', senderName: 'Mrs. Sarah Ochefu', text: 'Some student results are not showing up in the dashboard.', timestamp: new Date(Date.now() - 3700000).toISOString() },
            { id: 2, sender: 'support', senderName: 'Support Team', text: 'Which specific students are affected?', timestamp: new Date(Date.now() - 3600000).toISOString() }
          ]
        },
        {
          id: 'CHAT003',
          ticketId: 'TKT003',
          adminName: 'Mr. James Okonkwo',
          adminEmail: 'james.okonkwo@sttheresas.edu.ng',
          school: "St. Theresa's College, Okene",
          schoolId: 'SCH003',
          subject: 'Need to increase student capacity',
          lastMessage: 'Need to increase student capacity',
          lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
          unread: 0,
          status: 'resolved',
          messages: [
            { id: 1, sender: 'admin', senderName: 'Mr. James Okonkwo', text: 'We need to increase our student capacity from 1200 to 1500.', timestamp: new Date(Date.now() - 90000000).toISOString() },
            { id: 2, sender: 'support', senderName: 'Support Team', text: 'I have updated your school capacity. Please verify.', timestamp: new Date(Date.now() - 89000000).toISOString() },
            { id: 3, sender: 'admin', senderName: 'Mr. James Okonkwo', text: 'Confirmed working. Thank you!', timestamp: new Date(Date.now() - 88000000).toISOString() }
          ]
        }
      ];
      setActiveChats(demoChats);
      localStorage.setItem('super_admin_chats', JSON.stringify(demoChats));
    }
    setChatsLoaded(true);
  }, []);

  useEffect(() => {
    if (!chatsLoaded) return;
    if (!isOpen) {
      setSelectedChat(null);
      setView('list');
      return;
    }
    if (initialTicketId) {
      const chat = activeChats.find(c => c.ticketId === initialTicketId);
      if (chat) {
        const updatedChats = activeChats.map(c =>
          c.id === chat.id ? { ...c, unread: 0 } : c
        );
        setActiveChats(updatedChats);
        localStorage.setItem('super_admin_chats', JSON.stringify(updatedChats));
        const freshChat = updatedChats.find(c => c.id === chat.id);
        setSelectedChat(freshChat);
        setView('chat');
      } else {
        setView('list');
      }
    } else {
      setSelectedChat(null);
      setView('list');
    }
  }, [isOpen, initialTicketId, chatsLoaded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  const getChatDisabled = (chat) => {
    if (!chat) return true;
    if (chat.status === 'resolved') return true;
    const tickets = JSON.parse(localStorage.getItem('super_admin_tickets') || '[]');
    const ticket = tickets.find(t => t.id === chat.ticketId);
    if (ticket && ticket.status === 'closed') return true;
    return false;
  };

  const handleSelectChat = (chat) => {
    const updatedChats = activeChats.map(c =>
      c.id === chat.id ? { ...c, unread: 0 } : c
    );
    setActiveChats(updatedChats);
    localStorage.setItem('super_admin_chats', JSON.stringify(updatedChats));
    setSelectedChat(updatedChats.find(c => c.id === chat.id));
    setView('chat');
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    setView('list');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || getChatDisabled(selectedChat)) return;

    const message = {
      id: (selectedChat.messages?.length || 0) + 1,
      sender: 'support',
      senderName: user?.name || 'Support Team',
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...(selectedChat.messages || []), message];
    const updatedChat = {
      ...selectedChat,
      messages: updatedMessages,
      lastMessage: newMessage,
      lastMessageTime: new Date().toISOString()
    };

    const updatedChats = activeChats.map(chat =>
      chat.id === selectedChat.id ? updatedChat : chat
    );
    setSelectedChat(updatedChat);
    setActiveChats(updatedChats);
    localStorage.setItem('super_admin_chats', JSON.stringify(updatedChats));

    const tickets = JSON.parse(localStorage.getItem('super_admin_tickets') || '[]');
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedChat.ticketId) {
        return {
          ...ticket,
          messages: [
            ...ticket.messages,
            {
              sender: 'support',
              senderName: user?.name || 'Support Team',
              message: newMessage,
              timestamp: new Date().toISOString()
            }
          ],
          updatedAt: new Date().toISOString(),
          status: 'in-progress'
        };
      }
      return ticket;
    });
    localStorage.setItem('super_admin_tickets', JSON.stringify(updatedTickets));
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResolveChat = () => {
    if (!selectedChat) return;
    const updatedChat = { ...selectedChat, status: 'resolved' };
    const updatedChats = activeChats.map(chat =>
      chat.id === selectedChat.id ? updatedChat : chat
    );
    setSelectedChat(updatedChat);
    setActiveChats(updatedChats);
    localStorage.setItem('super_admin_chats', JSON.stringify(updatedChats));

    const tickets = JSON.parse(localStorage.getItem('super_admin_tickets') || '[]');
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedChat.ticketId) {
        return { ...ticket, status: 'closed', updatedAt: new Date().toISOString() };
      }
      return ticket;
    });
    localStorage.setItem('super_admin_tickets', JSON.stringify(updatedTickets));
    toast.success('Ticket marked as resolved');
  };

  const handleReopenChat = () => {
    if (!selectedChat) return;
    const updatedChat = { ...selectedChat, status: 'active' };
    const updatedChats = activeChats.map(chat =>
      chat.id === selectedChat.id ? updatedChat : chat
    );
    setSelectedChat(updatedChat);
    setActiveChats(updatedChats);
    localStorage.setItem('super_admin_chats', JSON.stringify(updatedChats));

    const tickets = JSON.parse(localStorage.getItem('super_admin_tickets') || '[]');
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedChat.ticketId) {
        return { ...ticket, status: 'in-progress', updatedAt: new Date().toISOString() };
      }
      return ticket;
    });
    localStorage.setItem('super_admin_tickets', JSON.stringify(updatedTickets));
    toast.success('Ticket reopened');
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    return `${diffDays} day ago`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  const disabled = getChatDisabled(selectedChat);

  return (
    <div className={chatContainer}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className={chatWindow}
        >
          <div className={chatHeader}>
            <div className="flex items-center gap-2">
              {view === 'chat' && selectedChat && (
                <button onClick={handleBackToList} className="text-white hover:text-gray-200 mr-2 text-lg">
                  ←
                </button>
              )}
              <div>
                <h3 className={chatHeaderTitle}>
                  {view === 'chat' && selectedChat ? selectedChat.adminName || 'Support Chat' : 'Support Center'}
                </h3>
                <p className="text-[10px] leading-[100%] font-[400] text-white/70 mt-1 font-playfair">
                  {view === 'chat' && selectedChat ? selectedChat.school || 'Active Chat' : 'Mega Tech Solutions'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className={chatHeaderClose}>×</button>
          </div>

          {view === 'list' ? (
            <div className="h-96 overflow-y-auto">
              {activeChats.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[13px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">No active chats</p>
                </div>
              ) : (
                activeChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileHover={{ backgroundColor: '#F5F5F5' }}
                    onClick={() => handleSelectChat(chat)}
                    className="p-4 border-b border-gray-100 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[14px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair">
                            {chat.adminName || 'Unknown Admin'}
                          </h4>
                          {chat.unread > 0 && (
                            <span className="px-1.5 py-0.5 bg-[#7C3AED] text-white text-[9px] leading-[100%] font-[600] rounded-full">
                              {chat.unread}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[8px] leading-[100%] font-[500] ${
                            chat.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {chat.status || 'inactive'}
                          </span>
                        </div>
                        <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair mb-1">
                          {chat.school || 'No school'}
                        </p>
                        <p className="text-[12px] leading-[140%] font-[500] text-[#1E1E1E] font-playfair truncate">
                          {chat.subject || 'No subject'}
                        </p>
                        <p className="text-[11px] leading-[100%] font-[400] text-[#626060] font-playfair mt-1 truncate">
                          {chat.lastMessage || 'No messages'}
                        </p>
                      </div>
                      <span className="text-[9px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair whitespace-nowrap ml-2">
                        {getTimeAgo(chat.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">
                        {(chat.messages && chat.messages.length) || 0} messages
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : selectedChat && (
            <>
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[12px] leading-[100%] font-[600] text-[#1E1E1E] font-playfair mb-1">
                      {selectedChat.subject || 'Support Chat'}
                    </p>
                    <p className="text-[10px] leading-[100%] font-[400] text-[#626060] font-playfair">
                      {selectedChat.adminEmail || 'No email'}
                    </p>
                  </div>
                  {selectedChat.status === 'resolved' ? (
                    <button
                      onClick={handleReopenChat}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[9px] leading-[100%] font-[500] hover:bg-blue-200 transition-colors"
                    >
                      Reopen Ticket
                    </button>
                  ) : (
                    <button
                      onClick={handleResolveChat}
                      className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[9px] leading-[100%] font-[500] hover:bg-green-200 transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] leading-[100%] font-[500] ${
                    selectedChat.status === 'active' ? 'bg-green-100 text-green-600' :
                    selectedChat.status === 'resolved' ? 'bg-gray-100 text-gray-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {selectedChat.status || 'inactive'}
                  </span>
                  <span className="text-[9px] leading-[100%] font-[400] text-[#9CA3AF] font-playfair">
                    Ticket #{selectedChat.ticketId}
                  </span>
                </div>
              </div>

              <div className={chatMessages}>
                {selectedChat.messages && selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${chatMessage} ${message.sender === 'support' ? chatMessageSent : chatMessageReceived}`}
                  >
                    <div className={`${chatBubble} ${message.sender === 'support' ? chatBubbleSent : chatBubbleReceived}`}>
                      {message.sender !== 'support' && message.senderName && (
                        <p className="text-[8px] leading-[100%] font-[600] text-[#7C3AED] mb-1 uppercase">
                          {message.senderName.split(' ')[0] || 'Admin'}
                        </p>
                      )}
                      {message.sender === 'support' && (
                        <p className="text-[8px] leading-[100%] font-[600] text-white/70 mb-1 uppercase">You</p>
                      )}
                      {message.text || ''}
                    </div>
                    <div className={chatTime}>{formatTime(message.timestamp)}</div>
                  </div>
                ))}
                {isTyping && !disabled && (
                  <div className={`${chatMessage} ${chatMessageReceived}`}>
                    <div className={`${chatBubble} ${chatBubbleReceived}`}>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className={chatInput}>
                {disabled ? (
                  <input
                    type="text"
                    value="This ticket is closed. Reopen to send messages."
                    disabled
                    className={chatDisabledInput}
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your reply..."
                      className={chatInputField}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={`${chatSendButton} ${!newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Send
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}