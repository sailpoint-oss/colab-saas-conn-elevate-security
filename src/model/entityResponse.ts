export class EntityResponse {
    individual?: string;
    email?: string;
    human_risk_score?: number;
    actions_score?: number;
    action_factor?: string;
    attack_factor?: string;
    malware?: number;
    secure_browsing?: number;
    actual_phishing?: number;
    training?: number;
    sensitive_data_handling?: number;
    simulated_phishing?: number;
    department?: string;
}
