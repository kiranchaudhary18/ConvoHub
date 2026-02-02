export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (date) => {
  const now = new Date();
  const msgDate = new Date(date);
  const diffTime = Math.abs(now - msgDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return formatTime(date);
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return msgDate.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return msgDate.toLocaleDateString('en-US');
  }
};

export const formatLastSeen = (date) => {
  if (!date) return 'unknown';
  
  const now = new Date();
  const lastSeen = new Date(date);
  const diffTime = Math.abs(now - lastSeen);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return 'yesterday at ' + lastSeen.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  } else if (diffDays < 7) {
    return lastSeen.toLocaleDateString('en-US', { weekday: 'short' }) + ' at ' + lastSeen.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  } else {
    return lastSeen.toLocaleDateString('en-US');
  }
};

export const truncateMessage = (message, length = 50) => {
  return message.length > length ? message.substring(0, length) + '...' : message;
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};
