export interface IssuesDataRow {
    Category: string;
    count: number;
}

export interface ChartDataRow {
    date: string;
    count: number;
}

export interface FilterConfig {
    neighborhood: string;
}

export interface TableRow {
    CaseID: number
    Opened: string
    Closed?: string
    Updated: string
    Status: string
    "Status Notes"?: string
    "Responsible Agency": string
    Category: string
    "Request Type": string
    "Request Details": string
    Address: string
    Street?: string
    "Supervisor District"?: number
    Neighborhood?: string
    "Police District"?: string
    Latitude: number
    Longitude: number
    Point: string
    Source: string
    "Media URL"?: string
    "SF Find Neighborhoods"?: number
    "Current Police Districts"?: number
    "Current Supervisor Districts"?: number
    "Analysis Neighborhoods"?: number
    "DELETE - Supervisor Districts"?: number
    "DELETE - Fire Prevention Districts"?: number
    "DELETE - Current Police Districts"?: number
    "DELETE - Zip Codes"?: number
    "DELETE - Police Districts"?: number
    "DELETE - Neighborhoods"?: number
    "DELETE - Neighborhoods_from_fyvs_ahh9"?: number
    "DELETE - 2017 Fix It Zones"?: number
    "DELETE - SF Find Neighborhoods"?: number
    "Civic Center Harm Reduction Project Boundary"?: number
    "DELETE - Current Supervisor Districts"?: number
    "Fix It Zones as of 2017-11-06"?: number
    "Invest In Neighborhoods (IIN) Areas"?: number
    "DELETE - HSOC Zones"?: number
    "Fix It Zones as of 2018-02-07"?: number
    "CBD, BID and GBD Boundaries as of 2017"?: number
    "Central Market/Tenderloin Boundary"?: number
    "Areas of Vulnerability, 2016"?: number
    "Central Market/Tenderloin Boundary Polygon - Updated"?: number
    "HSOC Zones as of 2018-06-05"?: number
    "OWED Public Spaces"?: number
    "Parks Alliance CPSI (27+TL sites)"?: number
    Neighborhoods?: number
}