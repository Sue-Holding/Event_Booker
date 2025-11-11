// open DB and set up object store
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('eventure-db', 4);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Users store
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'email' });
      }

      // Public events
      if (!db.objectStoreNames.contains('publicEvents')) {
        db.createObjectStore('publicEvents', { keyPath: 'id' });
      }

      // User-specific events (events created by that user)
      if (!db.objectStoreNames.contains('userEvents')) {
        const store = db.createObjectStore('userEvents', { keyPath: ['userId', 'id'] });
        store.createIndex('userId_idx', 'userId', { unique: false });
      }

      // User favorites
      if (!db.objectStoreNames.contains('favorites')) {
        const store = db.createObjectStore('favorites', { keyPath: ['userId', 'eventId'] });
        store.createIndex('userId_idx', 'userId', { unique: false });
      }

      // User bookings / booked events
      if (!db.objectStoreNames.contains('bookedEvents')) {
        const store = db.createObjectStore('bookedEvents', { keyPath: ['userId', 'eventId'] });
        store.createIndex('userId_idx', 'userId', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save user with token
export async function saveUser(user) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    store.put(user);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getUser(email) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const req = store.get(email);
    req.onsuccess = () => {
      const { result } = req;
      resolve(result);
    }
    req.onerror = () => reject(req.error);
  });
}

// PUBLIC EVENTS
export async function savePublicEvents(events) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('publicEvents', 'readwrite');
    const store = tx.objectStore('publicEvents');
    // events.forEach(event => {
    //   const eventToSave = { ...event, id: event.id || event._id };
    //   store.put(eventToSave);
    // });
    events.forEach(event => store.put({ ...event, id: event.id || event._id }));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPublicEvents() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('publicEvents')) {
      resolve([]);
      return;
    }
    const tx = db.transaction('publicEvents', 'readonly');
    const store = tx.objectStore('publicEvents');
    const req = store.getAll();
    req.onsuccess = () => {
      const { result } = req;
      resolve(result);
    }
    req.onerror = () => reject(req.error);
  });
}

// USER-SPECIFIC EVENTS - events created by that user
export async function saveUserEvents(userId, events) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('userEvents', 'readwrite');
    const store = tx.objectStore('userEvents');
    events.forEach(event => store.put({ ...event, userId, id: event.id || event._id }));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getUserEvents(userId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('userEvents')) {
      resolve([]);
      return;
    }
    const tx = db.transaction('userEvents', 'readonly');
    const store = tx.objectStore('userEvents');
    const req = store.getAll();
    req.onsuccess = () => {
      const { result } = req.result.filter(e => e.userId === userId);
      resolve(result);
  }
    req.onerror = () => reject(req.error);
  });
}


// FAVORITES
export async function saveFavorites(userId, favorites) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('favorites', 'readwrite');
    const store = tx.objectStore('favorites');

    favorites.forEach(fav => {
      // Save full event info for offline viewing
      const eventData = {
        userId,
        eventId: fav.id || fav._id,
        event: fav, // store the full event object
      };
      store.put(eventData);
    });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFavorites(userId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('favorites')) {
      resolve([]);
      return;
    }

    const tx = db.transaction('favorites', 'readonly');
    const store = tx.objectStore('favorites');
    const index = store.index('userId_idx');
    const req = index.getAll(IDBKeyRange.only(userId));

    req.onsuccess = () => {
      const resultArray = req.result
        .filter(f => f.userId === userId)
        .map(f => f.event); // return full event objects
      resolve(resultArray);
    };
    req.onerror = () => reject(req.error);
  });
}
// export async function saveFavorites(userId, favorites) {
//   const db = await openDB();
//   return new Promise((resolve, reject) => {
//     const tx = db.transaction('favorites', 'readwrite');
//     const store = tx.objectStore('favorites');
//     favorites.forEach(fav => store.put({ userId, eventId: fav.id || fav._id }));
//     tx.oncomplete = () => resolve();
//     tx.onerror = () => reject(tx.error);
//   });
// }

// export async function getFavorites(userId) {
//   const db = await openDB();
//   return new Promise((resolve, reject) => {
//     if (!db.objectStoreNames.contains('favorites')) { 
//       resolve([]);
//     return;
//   }
//     const tx = db.transaction('favorites', 'readonly');
//     const store = tx.objectStore('favorites');
//     const index = store.index('userId_idx');
//     const req = index.getAll(IDBKeyRange.only(userId));
//     req.onsuccess = () => {
//       const resultArray = req.result
//         .filter(f => f.userId === userId)
//         .map(f => f.eventId);
//       resolve(resultArray);
//     };
//     req.onerror = () => reject(req.error);
//   });
// }

// BOOKED EVENTS
export async function saveBookedEvents(userId, bookedEvents) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('bookedEvents', 'readwrite');
    const store = tx.objectStore('bookedEvents');

    bookedEvents.forEach(bkd => {
      const eventData = {
        userId,
        eventId: bkd.id || bkd._id,
        event: bkd, // store full event
      };
      store.put(eventData);
    });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getBookedEvents(userId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('bookedEvents')) {
      resolve([]);
      return;
    }

    const tx = db.transaction('bookedEvents', 'readonly');
    const store = tx.objectStore('bookedEvents');
    const index = store.index('userId_idx');
    const req = index.getAll(IDBKeyRange.only(userId));

    req.onsuccess = () => {
      const resultArray = req.result
        .filter(f => f.userId === userId)
        .map(f => f.event); // return full event objects
      resolve(resultArray);
    };
    req.onerror = () => reject(req.error);
  });
}
// export async function saveBookedEvents(userId, bookedEvents) {
//   const db = await openDB();
//   return new Promise((resolve, reject) => {
//     const tx = db.transaction('bookedEvents', 'readwrite');
//     const store = tx.objectStore('bookedEvents');
//     bookedEvents.forEach(bkd => store.put({ userId, eventId: bkd.id || bkd._id}));
//     tx.oncomplete = () => resolve();
//     tx.onerror = () => reject(tx.error);
//   });
// }

// export async function getBookedEvents(userId) {
//   const db = await openDB();
//   return new Promise((resolve, reject) => {
//     if (!db.objectStoreNames.contains('bookedEvents'))  {
//       resolve([]);
//       return;
//     }
//     const tx = db.transaction('bookedEvents', 'readonly');
//     const store = tx.objectStore('bookedEvents');
//     const index = store.index('userId_idx');
//     const req = index.getAll(IDBKeyRange.only(userId));
//     req.onsuccess = () => {
//       const { result } = req.result.filter(f => f.userId === userId).map(f => f.eventId);
//       resolve(result);
//     }
//     req.onerror = () => reject(req.error);
//   });
// }
