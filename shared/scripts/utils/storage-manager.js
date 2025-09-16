/**
 * A utility class for managing session storage in a structured way.
 * This implementation is based on the "10/10 Optimization Plan".
 */
export class StorageManager {
  /**
   * Manages scroll position storage.
   */
  static scroll = {
    /**
     * Saves the current vertical scroll position to session storage.
     * @param {string} [key='scroll'] - The key to save the scroll position under.
     */
    save: (key = 'scroll') => {
      try {
        sessionStorage.setItem(key, window.scrollY);
      } catch (e) {
        console.error("Could not save scroll position to sessionStorage:", e);
      }
    },

    /**
     * Restores the scroll position from session storage.
     * @param {string} [key='scroll'] - The key to restore the scroll position from.
     * @param {number} [offset=0] - An offset to apply to the restored position.
     */
    restore: (key = 'scroll', offset = 0) => {
      try {
        const pos = sessionStorage.getItem(key);
        if (pos) {
          window.scrollTo(0, parseInt(pos, 10) + offset);
        }
      } catch (e) {
        console.error("Could not restore scroll position from sessionStorage:", e);
      }
    }
  };

  /**
   * Manages module state storage.
   */
  static module = {
    /**
     * Sets the current module ID in session storage.
     * @param {string} id - The ID of the module to save.
     */
    setCurrent: (id) => {
      try {
        sessionStorage.setItem('currentModuleId', id);
      } catch (e) {
        console.error("Could not set current module in sessionStorage:", e);
      }
    },

    /**
     * Gets the current module ID from session storage.
     * @returns {string|null} The current module ID or null if not set.
     */
    getCurrent: () => {
      try {
        return sessionStorage.getItem('currentModuleId');
      } catch (e) {
        console.error("Could not get current module from sessionStorage:", e);
        return null;
      }
    },

    /**
     * Clears the current module ID from session storage.
     */
    clear: () => {
      try {
        sessionStorage.removeItem('currentModuleId');
      } catch (e) {
        console.error("Could not clear current module from sessionStorage:", e);
      }
    },

    /**
     * Sets the last visited module ID.
     * @param {string} id - The ID of the last visited module.
     */
    setLastVisited: (id) => {
         try {
            sessionStorage.setItem('lastVisitedModule', id);
         } catch(e) {
            console.error("Could not set last visited module in sessionStorage:", e);
         }
    },

    /**
     * Gets the last visited module ID.
     * @returns {string|null}
     */
    getLastVisited: () => {
        try {
            return sessionStorage.getItem('lastVisitedModule');
        } catch(e) {
            console.error("Could not get last visited module from sessionStorage:", e);
            return null;
        }
    },

    /**
     * Clears the last visited module ID.
     */
    clearLastVisited: () => {
        try {
            sessionStorage.removeItem('lastVisitedModule');
        } catch (e) {
            console.error("Could not clear last visited module from sessionStorage:", e);
        }
    }
  };
}
