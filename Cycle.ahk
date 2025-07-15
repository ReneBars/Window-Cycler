#NoEnv
#SingleInstance Force
SendMode Input
SetWorkingDir %A_ScriptDir%

; Clear any existing tooltips
ToolTip

; Variables
currentWindow := 1
maxWindows := 4
isRunning := false
windowList := []  ; Array to store window IDs in fixed order

; Start the cycling when script loads
Gosub, StartCycling

; Hotkeys
F1::Gosub, StartCycling    ; F1 to start cycling
F2::Gosub, StopCycling     ; F2 to stop cycling
F3::ExitApp                ; F3 to exit script

StartCycling:
    if (isRunning) {
        return
    }
    isRunning := true
    
    ; Get all Chrome windows and store them in fixed order
    WinGet, chromeWindows, List, ahk_exe chrome.exe
    
    ; Check if we have any Chrome windows
    if (chromeWindows = 0) {
        return
    }
    
    ; Clear and populate the window list
    windowList := []
    Loop, %chromeWindows%
    {
        windowList.Push(chromeWindows%A_Index%)
    }
    
    ; Reset current window to start
    currentWindow := 1
    
    SetTimer, CycleWindows, 60000
    ; Activate first window immediately
    Gosub, CycleWindows
return

StopCycling:
    isRunning := false
    SetTimer, CycleWindows, Off
    ToolTip  ; Clear any tooltips
return

CycleWindows:
    ; Check if we have windows in our list
    if (windowList.Length() = 0) {
        return
    }
    
    ; Get the window ID for the current window in our cycle
    windowID := windowList[currentWindow]
    
    ; Check if window still exists, if not remove it from list
    WinGet, windowExists, ID, ahk_id %windowID%
    if (!windowExists) {
        windowList.RemoveAt(currentWindow)
        ; Adjust currentWindow if we removed the last window
        if (currentWindow > windowList.Length()) {
            currentWindow := 1
        }
        ; Try again with the adjusted list
        if (windowList.Length() > 0) {
            Gosub, CycleWindows
        }
        return
    }
    
    ; Activate the window
    WinActivate, ahk_id %windowID%
    WinShow, ahk_id %windowID%
    
    ; Refresh the page using Ctrl + R (this works for most browsers)
    Send, ^r
    
    ; Move to next window for next cycle
    currentWindow++
    if (currentWindow > windowList.Length()) {
        currentWindow := 1
    }
return
