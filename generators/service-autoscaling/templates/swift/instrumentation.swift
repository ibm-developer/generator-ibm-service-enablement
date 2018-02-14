import LoggerAPI
import CloudEnvironment
import SwiftMetricsBluemix

func initializeServiceAutoscaling(cloudEnv: CloudEnv) throws -> SwiftMetricsBluemix? {
    guard let swiftMetrics = swiftMetrics else {
        Log.warning("Failed to initialize Auto-Scaling because metrics is not initialized.")
        return nil
    }
    let autoscaling = SwiftMetricsBluemix(swiftMetricsInstance: swiftMetrics)
    Log.info("Initialized Auto-Scaling.")
    return autoscaling
}
