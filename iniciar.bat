@echo off
title Audio Stream
pip install sounddevice numpy
py "%~dp0server_pc.py"
pause
