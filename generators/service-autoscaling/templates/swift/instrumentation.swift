import LoggerAPI
import SwiftMetricsBluemix

var autoscaling: SwiftMetricsBluemix?

func initializeServiceAutoscaling() throws {
    guard let swiftMetrics = swiftMetrics else {
        Log.warning("Failed to initialize Auto-Scaling because metrics is not initialized.")
        return
    }
    autoscaling = SwiftMetricsBluemix(swiftMetricsInstance: swiftMetrics)
    Log.info("Initialized Auto-Scaling.")
}
