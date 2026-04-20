import { useEffect, useCallback } from 'react';
import { supabase }               from '../services/supabase.js';
import { useAuth }                from '../context/AuthContext.jsx';

/**
 * useRealtime — subscribes to Supabase Realtime for transactions and budgets.
 * Calls onUpdate() whenever a row is inserted/updated/deleted for this user.
 *
 * @param {Function} onUpdate  - callback to re-fetch data
 * @param {string[]} tables    - which tables to watch: ['transactions','budgets']
 */
export function useRealtime(onUpdate, tables = ['transactions']) {
  const { user } = useAuth();

  const stableUpdate = useCallback(() => {
    if (onUpdate) onUpdate();
  }, [onUpdate]);

  useEffect(() => {
    if (!user?.id) return;

    const channels = tables.map((table) => {
      const channel = supabase
        .channel(`${table}_${user.id}`)
        .on(
          'postgres_changes',
          {
            event:  '*',
            schema: 'public',
            table,
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log(`[Realtime] ${table} changed:`, payload.eventType);
            stableUpdate();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`[Realtime] Subscribed to ${table}`);
          }
        });

      return channel;
    });

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [user?.id, tables.join(','), stableUpdate]);
}
