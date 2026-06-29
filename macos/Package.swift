// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "macos",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "macos",
            targets: ["macos"]
        ),
    ],
    targets: [
        .target(
            name: "macos"
        ),
        .testTarget(
            name: "macosTests",
            dependencies: ["macos"]
        ),
    ]
)
