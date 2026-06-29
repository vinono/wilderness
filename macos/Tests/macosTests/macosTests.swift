import XCTest
@testable import macos

class FocusTimerTests: XCTestCase {
    
    func testInitialState() {
        let timer = FocusTimer(mode: .pomodoro, presetMinutes: 25)
        XCTAssertEqual(timer.mode, .pomodoro)
        XCTAssertEqual(timer.timeLeft, 25 * 60)
        XCTAssertFalse(timer.isRunning)
    }
    
    func testTimerTicking() {
        let timer = FocusTimer(mode: .pomodoro, presetMinutes: 25)
        timer.start()
        XCTAssertTrue(timer.isRunning)
        
        timer.tick(delta: 5)
        XCTAssertEqual(timer.timeLeft, 25 * 60 - 5)
    }
    
    func testTimerFinishing() {
        let timer = FocusTimer(mode: .pomodoro, presetMinutes: 1)
        timer.start()
        
        var isCalled = false
        timer.onTimerFinished = {
            isCalled = true
        }
        
        timer.tick(delta: 60)
        XCTAssertEqual(timer.timeLeft, 0)
        XCTAssertFalse(timer.isRunning)
        XCTAssertTrue(isCalled)
    }
    
    func testStopwatchMode() {
        let timer = FocusTimer(mode: .stopwatch)
        XCTAssertEqual(timer.timeLeft, 0)
        
        timer.start()
        timer.tick(delta: 10)
        XCTAssertEqual(timer.timeLeft, 10)
        
        timer.reset()
        XCTAssertEqual(timer.timeLeft, 0)
        XCTAssertFalse(timer.isRunning)
    }
}

class BreathingManagerTests: XCTestCase {
    
    func testTransitions() {
        let manager = BreathingManager()
        XCTAssertEqual(manager.state, .idle)
        
        manager.start()
        XCTAssertEqual(manager.state, .inhale)
        XCTAssertEqual(manager.timeLeft, 4)
        
        // 步进 3 秒
        manager.tick() // 3
        manager.tick() // 2
        manager.tick() // 1
        XCTAssertEqual(manager.state, .inhale)
        
        // 第 4 秒，触发状态跳转到 hold
        manager.tick()
        XCTAssertEqual(manager.state, .hold)
        XCTAssertEqual(manager.timeLeft, 4)
        
        // 再次步进 4 秒到 exhale
        for _ in 1...4 { manager.tick() }
        XCTAssertEqual(manager.state, .exhale)
        
        // 再次步进 4 秒到 hold2
        for _ in 1...4 { manager.tick() }
        XCTAssertEqual(manager.state, .hold2)
        
        // 再次步进 4 秒回到 inhale 循环
        for _ in 1...4 { manager.tick() }
        XCTAssertEqual(manager.state, .inhale)
        
        manager.stop()
        XCTAssertEqual(manager.state, .idle)
    }
}
