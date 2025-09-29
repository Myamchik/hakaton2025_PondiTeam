# Базовый образ с Python и Linux
FROM python:3.11-slim

# Устанавливаем нужные пакеты
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Устанавливаем onnx2tf и tensorflowjs
RUN pip install --no-cache-dir onnx2tf tensorflow tensorflowjs

# Создаём рабочую директорию
WORKDIR /workspace

# По умолчанию команда — открыть shell
CMD ["/bin/bash"]
