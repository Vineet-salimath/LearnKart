import { create } from 'zustand';

export const useUIStore = create((set) => ({
  notifications: [],
  isLoading: false,

  addNotification: (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }]
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    }, duration);

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  setLoading: (isLoading) => set({ isLoading }),

  success: (message, duration) => {
    return set((state) => {
      const id = Date.now();
      const notifications = [...state.notifications, { id, message, type: 'success' }];

      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      }, duration || 3000);

      return { notifications };
    });
  },

  error: (message, duration) => {
    return set((state) => {
      const id = Date.now();
      const notifications = [...state.notifications, { id, message, type: 'error' }];

      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      }, duration || 4000);

      return { notifications };
    });
  },
}));
