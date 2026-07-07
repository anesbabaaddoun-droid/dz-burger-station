import { useState, useEffect, useMemo } from 'react';
import {
    collection, onSnapshot, query,
    orderBy, DocumentData, QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UseRealtimeCollectionReturn {
    data: (DocumentData & { id: string })[];
    isLoading: boolean;
    error: string | null;
    total: number;
}

export function useRealtimeCollection(
    collectionName: string,
    orderByField?: string
): UseRealtimeCollectionReturn {
    const [data, setData] = useState<(DocumentData & { id: string })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const constraints: QueryConstraint[] = [];
        if (orderByField) constraints.push(orderBy(orderByField, 'desc'));
        const q = query(collection(db, collectionName), ...constraints);

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
                setData(docs);
                setIsLoading(false);
            },
            (err) => {
                setError('Failed to listen to collection');
                console.error(err);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [collectionName, orderByField]);

    const total = useMemo(() => data.length, [data]);

    return { data, isLoading, error, total };
}