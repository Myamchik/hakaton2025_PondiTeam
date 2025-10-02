import onnx

# Загружаем модель
model_path = "best.onnx"  # путь к твоему onnx файлу
model = onnx.load(model_path)

# Проверяем модель на корректность
onnx.checker.check_model(model)
print("✅ ONNX модель корректна!")

# Выводим информацию о входах и выходах
print("Inputs:")
for inp in model.graph.input:
    print(f"  {inp.name}, shape: {[d.dim_value for d in inp.type.tensor_type.shape.dim]}")

print("Outputs:")
for out in model.graph.output:
    print(f"  {out.name}, shape: {[d.dim_value for d in out.type.tensor_type.shape.dim]}")
