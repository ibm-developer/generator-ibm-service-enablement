import Foundation
import LoggerAPI
import CloudEnvironment
import AssistantV1

func initializeServiceWatsonAssistant(cloudEnv: CloudEnv) throws -> Assistant {
    // Load credentials for Watson conversation using CloudEnvironment
    guard let assistantCredentials = cloudEnv.getWatsonAssistantCredentials(name: "{{servLookupKey}}") else {
        throw InitializationError("Could not load credentials for Watson Assistant.")
    }
    // For version, use today's date for the most recent version
    // https://github.com/watson-developer-cloud/swift-sdk#assistant
    let version = getVersion()
    let assistant = Assistant(version: version, apiKey: assistantCredentials.apiKey)

    // Set region URL for Watson Assistant
    assistant.serviceURL = assistantCredentials.url

    Log.info("Found and loaded credentials for Watson Assistant.")
    return assistant
}

private func getVersion() -> String {
    let dateFormatter = DateFormatter()
    dateFormatter.dateFormat = "yyyy-MM-dd"
    let dateStr = dateFormatter.string(from: Date())
    return dateStr
}
