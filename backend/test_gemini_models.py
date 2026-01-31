#!/usr/bin/env python3
"""
Script para listar todos os modelos Gemini disponíveis na sua API key
Execute: python check_gemini_models.py
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configura a API
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ GEMINI_API_KEY não encontrada no .env")
    exit(1)

genai.configure(api_key=api_key)

print("🔍 Buscando modelos disponíveis do Google Gemini...\n")
print("=" * 70)

try:
    # Lista todos os modelos disponíveis
    models = genai.list_models()
    
    print(f"\n✅ Modelos disponíveis na sua API key:\n")
    
    for model in models:
        # Filtra apenas modelos que suportam generateContent
        if 'generateContent' in model.supported_generation_methods:
            print(f"📦 {model.name}")
            print(f"   Display Name: {model.display_name}")
            print(f"   Descrição: {model.description}")
            print(f"   Métodos: {', '.join(model.supported_generation_methods)}")
            print(f"   " + "-" * 66)
    
    print("\n" + "=" * 70)
    print("\n💡 Modelos recomendados para usar no código:\n")
    print("   • gemini-pro (mais estável)")
    print("   • gemini-1.0-pro")
    print("   • gemini-1.5-pro (se disponível)")
    print("   • gemini-1.5-flash (se disponível)")
    
    print("\n🔧 Para usar no código, altere em llm_service.py:")
    print("   model = genai.GenerativeModel('gemini-pro')  # ← Use um dos modelos acima")
    
except Exception as e:
    print(f"\n❌ Erro ao listar modelos: {e}")
    print("\n💡 Dica: Verifique se sua GEMINI_API_KEY está correta no .env")

print("\n" + "=" * 70 + "\n")