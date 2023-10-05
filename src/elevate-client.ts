import { StdTestConnectionOutput } from '@sailpoint/connector-sdk'
import { Config } from './model/config'
import { InvalidConfigurationError } from './errors/invalid-configuration-error'
import { EntityResponse } from './model/entityResponse'
import axios, { AxiosError, AxiosResponse } from 'axios'

export class ElevateClient {
    private readonly apiKey?: string
    private readonly apiTenant?: string
    private readonly baseUrl?: string
    private readonly departments?: string

    constructor(config: Config) {
        // Fetch necessary properties from config.
        this.apiKey = config.apiKey
        if (this.apiKey == null) {
            throw new InvalidConfigurationError('apiKey must be provided from config')
        }

        this.apiTenant = config.apiTenant
        if (this.apiTenant == null) {
            throw new InvalidConfigurationError('apiTenant must be provided from config')
        }

        this.baseUrl = config.baseUrl
        if (this.baseUrl == null) {
            throw new InvalidConfigurationError('baseUrl must be provided from config')
        }

        this.departments = config.departments
        if (this.departments == null) {
            this.departments = ''
            throw new InvalidConfigurationError('departments must be provided from config')
        }
        axios.defaults.headers.common['X-Tenant'] = this.apiTenant ?? ''
        axios.defaults.headers.common['X-API-KEY'] = this.apiKey ?? ''
        axios.defaults.headers.common['Content-Type'] = 'application/json'
    }

    /**
     * Test connection by getting the overall org risk score.
     * This will make sure the apiKey and Tenant settings are working
     * @returns overall: [risk score] if response is 2XX
     */
    async testConnection(): Promise<StdTestConnectionOutput> {
        const URL = this.baseUrl + '/reputations/organization/risk_scores'
        axios
            .get(URL)
            .then((response) => {
                console.log(response.data)
            })
            .catch((err) => console.log(err))
        return {}
    }

    /**
     * Gets users from elevate security tenant
     * @returns {Promise<EntityResponse[]>} the users.
     */
    async getAllUsers(): Promise<EntityResponse[]> {
        // If the departments parameter is csv then more than one department is present
        const departmentValues = this.departments!.split(',')
        let users: EntityResponse[] = []
        for (let i = 0; i < departmentValues.length; i++) {
            let elevateDepartment = departmentValues[i]
            let departmentFilter = ''
            if (elevateDepartment != '*') {
                // * is a wildcard for all departments, if it's not * then use the department filter
                departmentFilter = 'filters=department EQ ' + elevateDepartment + '&'
            } else {
                if (i > 0) {
                    // If an * is encountered and it's not the first item in the list, skip it
                    continue
                }
            }
            const URL =
                this.baseUrl + '/reputations/analysis/risks?&' + departmentFilter + 'page_size=100&page_number='
            let pageNumber = 1
            let hasMorePages = true
            let getURL = ''
            console.log(users)
            while (hasMorePages) {
                getURL = URL + pageNumber
                console.log(getURL)
                await axios
                    .get(getURL)
                    .then((response) => {
                        hasMorePages = response.data.has_next
                        hasMorePages ? (pageNumber += 1) : (hasMorePages = false)
                        users = users.concat(response.data.results)
                        if (!hasMorePages) {
                            console.log('All Done! Total Pages:' + pageNumber)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
            if (elevateDepartment == '*') {
                // If * was used break the loop
                break
            }
        }
        return users
    }
}
