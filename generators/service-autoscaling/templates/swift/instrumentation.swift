import LoggerAPI
import CloudEnvironment
import SwiftMetricsBluemix

var autoscaling: SwiftMetricsBluemix?

func initializeServiceAutoscaling() {
    guard let swiftMetrics = swiftMetrics else {
        Log.warning("Failed to initialize Auto-Scaling because metrics is not initialized.")
        return
    }
    autoscaling = SwiftMetricsBluemix(swiftMetricsInstance: swiftMetrics)
    Log.info("Initialized Auto-Scaling.")
}
