#!/usr/bin/env python3
"""
Script para testar quais modelos Gemini funcionam com generateContent
(Versão sem dependências extras)
Execute: python test_working_models_simple.py
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

print("\n" + "="*80)
print("🧪 Testando modelos Gemini com generateContent")
print("="*80 + "\n")

# Lista de modelos para testar (os mais relevantes)
models_to_test = [
    # Gemini 2.5 (Mais recentes e estáveis)
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.5-flash-lite',
    
    # Gemini 2.0
    'gemini-2.0-flash',
    'gemini-2.0-flash-001',
    'gemini-2.0-flash-lite',
    
    # Gemini 3.0 Preview
    'gemini-3-flash-preview',
    'gemini-3-pro-preview',
    
    # Aliases (sempre apontam para versão mais recente)
    'gemini-flash-latest',
    'gemini-pro-latest',
    
    # Gemini 1.5 (caso ainda existam)
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    
    # Gemini 1.0
    'gemini-pro',
    'gemini-1.0-pro',
]

working_models = []
failed_models = []

test_prompt = "Return only the word 'OK' in JSON format: {\"status\": \"OK\"}"

print(f"📋 Testando {len(models_to_test)} modelos...\n")

for i, model_name in enumerate(models_to_test, 1):
    try:
        print(f"[{i}/{len(models_to_test)}] Testando: {model_name}...", end=" ")
        
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(test_prompt)
        
        # Verifica se obteve resposta
        if response.text:
            print("✅ FUNCIONA")
            working_models.append({
                'name': model_name,
                'response': response.text[:50].replace('\n', ' ')
            })
        else:
            print("⚠️  Sem resposta")
            failed_models.append({
                'name': model_name,
                'error': 'No response text'
            })
            
    except Exception as e:
        error_msg = str(e)
        
        if "404" in error_msg or "not found" in error_msg.lower():
            print("❌ NÃO EXISTE")
            failed_models.append({
                'name': model_name,
                'error': 'Model not found (404)'
            })
        elif "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            print("⚠️  RATE LIMIT")
            failed_models.append({
                'name': model_name,
                'error': 'Rate limit exceeded'
            })
        elif "PERMISSION_DENIED" in error_msg:
            print("⚠️  SEM PERMISSÃO")
            failed_models.append({
                'name': model_name,
                'error': 'Permission denied'
            })
        else:
            print("❌ ERRO")
            failed_models.append({
                'name': model_name,
                'error': error_msg[:80]
            })

# Resumo dos resultados
print("\n" + "="*80)
print(f"✅ MODELOS QUE FUNCIONAM ({len(working_models)})")
print("="*80 + "\n")

if working_models:
    for idx, model in enumerate(working_models, 1):
        print(f"{idx}. {model['name']}")
        print(f"   Resposta: {model['response']}")
else:
    print("Nenhum modelo funcionou! Verifique sua API key.")

print("\n" + "="*80)
print(f"❌ MODELOS QUE FALHARAM ({len(failed_models)})")
print("="*80 + "\n")

if failed_models:
    for idx, model in enumerate(failed_models, 1):
        print(f"{idx}. {model['name']}")
        print(f"   Erro: {model['error']}")
else:
    print("Todos os modelos testados funcionaram!")

# Recomendações
print("\n" + "="*80)
print("🎯 RECOMENDAÇÕES PARA SEU PROJETO")
print("="*80 + "\n")

if working_models:
    # Prioriza modelos mais recentes e estáveis
    recommended = None
    
    priority_list = [
        'gemini-2.5-flash',      # Melhor custo-benefício
        'gemini-2.5-pro',        # Mais poderoso
        'gemini-flash-latest',   # Sempre atualizado
        'gemini-2.0-flash',      # Versão anterior
        'gemini-pro-latest',     # Alias pro
        'gemini-pro'             # Fallback
    ]
    
    for priority in priority_list:
        if any(m['name'] == priority for m in working_models):
            recommended = priority
            break
    
    if recommended:
        print(f"✨ MODELO RECOMENDADO: {recommended}")
        print(f"\nUse este código em backend/app/services/llm_service.py:\n")
        print(f"model = genai.GenerativeModel('{recommended}')\n")
        
        # Mostra alternativas
        alternatives = [m['name'] for m in working_models if m['name'] != recommended][:3]
        if alternatives:
            print("Alternativas válidas:")
            for alt in alternatives:
                print(f"  • {alt}")
    else:
        print("Use qualquer um dos modelos que funcionaram acima.")

# Código completo para copiar
if working_models and recommended:
    print("\n" + "="*80)
    print("📋 CÓDIGO COMPLETO PARA USAR")
    print("="*80 + "\n")
    
    print("Substitua a linha do modelo em llm_service.py por:\n")
    print("# Linha ~55-56")
    print(f"model = genai.GenerativeModel('{recommended}')")
    print()

print("="*80 + "\n")

# Estatísticas
print(f"📊 ESTATÍSTICAS:")
print(f"   • Total testado: {len(models_to_test)}")
print(f"   • Funcionando: {len(working_models)} ({len(working_models)/len(models_to_test)*100:.1f}%)")
print(f"   • Falharam: {len(failed_models)} ({len(failed_models)/len(models_to_test)*100:.1f}%)")
print()