import Foundation

public enum TimerMode: String {
    case pomodoro
    case stopwatch
}

public class FocusTimer {
    public var mode: TimerMode
    public var timeLeft: Int
    public var isRunning: Bool = false
    public var pomodoroPresetMinutes: Int = 25
    
    // 回调钩子，倒数结束时调用
    public var onTimerFinished: (() -> Void)?
    
    public init(mode: TimerMode = .pomodoro, presetMinutes: Int = 25) {
        self.mode = mode
        self.pomodoroPresetMinutes = presetMinutes
        self.timeLeft = presetMinutes * 60
    }
    
    public func start() {
        isRunning = true
    }
    
    public func pause() {
        isRunning = false
    }
    
    public func reset() {
        isRunning = false
        if mode == .pomodoro {
            timeLeft = pomodoroPresetMinutes * 60
        } else {
            timeLeft = 0
        }
    }
    
    public func setPreset(minutes: Int) {
        mode = .pomodoro
        pomodoroPresetMinutes = minutes
        timeLeft = minutes * 60
        isRunning = false
    }
    
    public func toggleStopwatchMode() {
        if mode == .stopwatch {
            mode = .pomodoro
            reset()
        } else {
            mode = .stopwatch
            timeLeft = 0
            isRunning = false
        }
    }
    
    // 步进时间计时
    public func tick(delta: Int = 1) {
        guard isRunning else { return }
        
        if mode == .pomodoro {
            if timeLeft <= delta {
                timeLeft = 0
                isRunning = false
                onTimerFinished?()
            } else {
                timeLeft -= delta
            }
        } else {
            timeLeft += delta
        }
    }
}
