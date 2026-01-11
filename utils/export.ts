
export const exportToCSV = (data: any[], filename: string) => {
    if (!data || !data.length) {
        console.warn("No data to export");
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row =>
            headers.map(header => {
                const cell = row[header] === null || row[header] === undefined ? '' : row[header];
                // Escape quotes and wrap in quotes if contains comma
                const escaped = ('' + cell).replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(',')
        )
    ].join('\n');

    // Create download link with BOM for Excel compatibility
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    link.click();
    document.body.removeChild(link);
};

// --- ICS Calendar Export ---
import { Request, RequestCategory } from '../types';

export const downloadICS = (request: Request) => {
    // Helper to format date for ICS (YYYYMMDD)
    const formatDate = (dateStr: string) => {
        return dateStr.replace(/-/g, '');
    };

    // Helper to format time for ICS (THHMMSS)
    // Assumes simple "HH:MM" or "HH:MM AM/PM" format, normalized to 24h zulu if possible, or floating
    // For simplicity in this mock, we'll use floating local time or just date if no specific time
    // Parsing logic mirrored from Volunteer.tsx
    const formatDateTime = (dateStr: string, timeStr?: string) => {
        const d = formatDate(dateStr);
        if (!timeStr) return d; // All day

        // Very basic parser for "10:00 AM" etc
        // If complex, just return date to avoid errors
        return d;
    };

    // Calculate start/end
    const dateStr = formatDate(request.date);

    // Create ICS content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NPVN//Volunteer Network//EN
BEGIN:VEVENT
UID:${request.id}@npvn.org
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;VALUE=DATE:${dateStr}
SUMMARY:NPVN: ${request.category} - ${request.subcategory}
DESCRIPTION:${request.description}
LOCATION:${request.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `event-${request.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

