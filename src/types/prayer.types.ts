export interface JadwalItem {
    tanggal: number;
    tanggal_lengkap: string;
    hari: string;
    imsak: string;
    subuh: string;
    terbit: string;
    dhuha: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
}

export interface PrayerTimeData {
    provinsi: string;
    kabkota: string;
    bulan: number;
    tahun: number;
    bulan_nama: string;
    jadwal: JadwalItem[];
}

export interface PrayerPayload {
    kabkota: string;
    provinsi: string;
    bulan: number;
    tahun: number;
}

export interface SavedPrayerLocation {
    locationName: string;
    locationType: "auto" | "manual" | null;
    city?: string;
    province?: string;
}
