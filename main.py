from dotenv import load_dotenv
from fastapi import FastAPI, responses
from urllib.parse import urlencode
import base64
import requests
import json
import os

load_dotenv('.env')

app = FastAPI()

SUPABASE_CLIENT_ID = os.getenv("SUPABASE_CLIENT_ID")
SUPABASE_CLIENT_SECRET = os.getenv("SUPABASE_CLIENT_SECRET") 
REDIRECT_URI = "http://localhost:54321/redirect"
SUPABASE_AUTH_URL = "https://api.supabase.com/v1/oauth/authorize"
SUPABASE_TOKEN_URL = "https://api.supabase.com/v1/oauth/token"

@app.get("/authorize")
async def initiate_supabase_oauth():
    params = {
        "client_id": SUPABASE_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": "openid profile email" 
    }
    authorization_url = f"{SUPABASE_AUTH_URL}?{urlencode(params)}"
    return responses.RedirectResponse(url=authorization_url)

@app.get("/redirect")
async def supabase_auth_success(code):
    bearer_token = base64.b64encode(str.encode(SUPABASE_CLIENT_ID + ":" + SUPABASE_CLIENT_SECRET))
    headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
    'Authorization': f'Bearer {bearer_token}'
    }
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': SUPABASE_CLIENT_ID,
        'client_secret': SUPABASE_CLIENT_SECRET,
        'redirect_uri': REDIRECT_URI
    }
    response = requests.post(url=SUPABASE_TOKEN_URL, headers=headers, data=data)
    content = json.loads(response.content.decode('utf-8'))
    token = content['access_token']
    frontend_redirect_url = f"http://localhost:3000/dashboard?token={token}"
    return responses.RedirectResponse(url=frontend_redirect_url)

@app.get("/extract-data")
async def extract_data_from_supabase(token):
    projects_info = get_project_info(token)
    projects_data = {}
    for project_info in projects_info:
        id = project_info['id']
        project_data = {}
        mfa, id_map = mfa_user_check(token, id)
        project_data['mfa_user_check'] = mfa
        project_data['id_to_email_map'] = id_map
        project_data['table_rls_check'] = table_rls_check(token, id)
        project_data['pitr_check'] = pitr_check(token, id)
        project_data['proj_name'] = project_info['name']
        projects_data[id] = project_data

    return projects_data

def get_project_info(token):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = requests.get(url="https://api.supabase.com/v1/projects", headers=headers)
    return json.loads(response.content.decode('utf-8'))

def execute_sql_query(query, token, id):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    data = {
        "query": query
    }
    response = requests.post(url=f"https://api.supabase.com/v1/projects/{id}/database/query", headers=headers, json=data)
    return json.loads(response.content.decode('utf-8'))

def mfa_user_check(token, id):
    all_users = execute_sql_query("SELECT id, email FROM auth.users", token, id)
    users_with_mfa_disabled = execute_sql_query("SELECT id FROM auth.users WHERE id NOT IN (SELECT DISTINCT user_id FROM auth.mfa_factors)", token, id)
    users_mfa_map = {}
    id_to_email_map = {}
    for user in all_users:
        id_to_email_map[user['id']] = user['email']
        if user in users_with_mfa_disabled:
            users_mfa_map[user['id']] = False
        else:
            users_mfa_map[user['id']] = True
    return users_mfa_map, id_to_email_map

def table_rls_check(token, id):
    rls_data = execute_sql_query("SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'", token, id)
    tables_rls_map = {}
    for data in rls_data:
        tables_rls_map[data['tablename']] = data['rowsecurity']
    return tables_rls_map


def pitr_check(token, id):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = requests.get(url=f"https://api.supabase.com/v1/projects/{id}/database/backups", headers=headers)
    response_json = json.loads(response.content.decode('utf-8'))
    return response_json['pitr_enabled']


@app.get("/")
async def root():
    print("root")