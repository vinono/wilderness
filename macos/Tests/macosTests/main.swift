import Foundation

// 轻量级自测试断言方法
func expect(_ condition: Bool, _ message: String = "") {
    if !condition {
        fatalError("❌ Test Assertion Failed: \(message)")
    }
}

print("🚀 Starting macOS Focus Terminal Unit Tests...")

// 1. FocusTimer 单元自测
do {
    let timer = FocusTimer(mode: .pomodoro, presetMinutes: 25)
    expect(timer.mode == .pomodoro, "Initial mode should be pomodoro")
    expect(timer.timeLeft == 25 * 60, "Initial time should be 25 mins")
    
    timer.start()
    expect(timer.isRunning, "Timer should be running")
    
    timer.tick(delta: 5)
    expect(timer.timeLeft == 25 * 60 - 5, "Time should decrement by 5s")
    
    timer.reset()
    expect(!timer.isRunning, "Timer should stop after reset")
    expect(timer.timeLeft == 25 * 60, "Time should reset to preset")
    
    // 测试倒计时结束回调
    let miniTimer = FocusTimer(mode: .pomodoro, presetMinutes: 1)
    miniTimer.start()
    var finished = false
    miniTimer.onTimerFinished = { finished = true }
    miniTimer.tick(delta: 60)
    expect(miniTimer.timeLeft == 0, "Time left should be 0")
    expect(finished, "Finished callback should be triggered")
    
    print("✔ FocusTimer unit tests passed.")
}

// 2. BreathingManager 单元自测
do {
    let manager = BreathingManager()
    expect(manager.state == .idle, "Initial state should be idle")
    
    manager.start()
    expect(manager.state == .inhale, "State should be inhale after start")
    expect(manager.timeLeft == 4, "Time left should be 4s")
    
    manager.tick() // 3
    manager.tick() // 2
    manager.tick() // 1
    expect(manager.state == .inhale, "State should remain inhale")
    
    manager.tick() // 跳转至 hold
    expect(manager.state == .hold, "State should transition to hold")
    expect(manager.timeLeft == 4, "Time left should reset to 4s")
    
    for _ in 1...4 { manager.tick() } // exhale
    expect(manager.state == .exhale, "Should be exhale")
    
    for _ in 1...4 { manager.tick() } // hold2
    expect(manager.state == .hold2, "Should be hold2")
    
    for _ in 1...4 { manager.tick() } // inhale
    expect(manager.state == .inhale, "Should cycle back to inhale")
    
    manager.stop()
    expect(manager.state == .idle, "Should return to idle")
    
    print("✔ BreathingManager unit tests passed.")
}

print("🎉 All macOS Swift tests passed successfully! [100% SUCCESS]")
