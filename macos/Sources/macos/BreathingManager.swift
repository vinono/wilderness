import Foundation

public enum BreathingState: String {
    case idle
    case inhale // 吸气 4s
    case hold   // 憋气 4s
    case exhale // 呼气 4s
    case hold2  // 静息 4s
}

public class BreathingManager {
    public var state: BreathingState = .idle
    public var timeLeft: Int = 4
    
    public init() {}
    
    public func start() {
        state = .inhale
        timeLeft = 4
    }
    
    public func stop() {
        state = .idle
        timeLeft = 4
    }
    
    // 盒式呼吸的秒数状态机跳转
    public func tick() {
        guard state != .idle else { return }
        
        if timeLeft <= 1 {
            switch state {
            case .inhale:
                state = .hold
                timeLeft = 4
            case .hold:
                state = .exhale
                timeLeft = 4
            case .exhale:
                state = .hold2
                timeLeft = 4
            case .hold2:
                state = .inhale
                timeLeft = 4
            case .idle:
                break
            }
        } else {
            timeLeft -= 1
        }
    }
}
