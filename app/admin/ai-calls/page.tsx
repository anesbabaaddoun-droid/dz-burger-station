{
  customerName: string,
    customerPhone: string,
      status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed',
        orderType: 'Delivery' | 'Pickup',
          source: 'AI Call',
            summary: string,
              duration: string,
                total: number,
                  transcript: string,
                    aiCallId: string | null,
                      createdAt: Timestamp,
                        updatedAt: Timestamp,
}