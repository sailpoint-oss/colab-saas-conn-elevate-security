import { StdAccountCreateOutput, StdAccountListOutput} from "@sailpoint/connector-sdk";
import {EntityResponse} from "./model/entityResponse";

export class Util {
    /**
     * converts user object to IDN account output
     *
     * @param {EntityResponse} EntityResponse object
     * @returns {StdAccountListOutput} IDN account create object
     */
    public userToAccount(entityResponse: EntityResponse): StdAccountListOutput {
        return  {
            identity: entityResponse.individual ? entityResponse.individual : '',
            uuid: entityResponse.email ? entityResponse.email : '',
            attributes: {
                email: entityResponse.email ? entityResponse.email : '',
                individual: entityResponse.individual ? entityResponse.individual : '',
                human_risk_score: entityResponse.human_risk_score ? entityResponse.human_risk_score : '',
                actions_score: entityResponse.actions_score ? entityResponse.actions_score : '',
                action_factor: entityResponse.action_factor ? entityResponse.action_factor : '',
                attack_factor: entityResponse.attack_factor ? entityResponse.attack_factor : '',
                malware: entityResponse.malware ? entityResponse.malware : '',
                secure_browsing: entityResponse.secure_browsing ? entityResponse.secure_browsing : '',
                actual_phishing: entityResponse.actual_phishing ? entityResponse.actual_phishing : '',
                training: entityResponse.training ? entityResponse.training : '',
                sensitive_data_handling: entityResponse.sensitive_data_handling ? entityResponse.sensitive_data_handling : '',
                simulated_phishing: entityResponse.simulated_phishing ? entityResponse.simulated_phishing : '',
                department: entityResponse.department ? entityResponse.department : '',
            }
        }
    }
}
