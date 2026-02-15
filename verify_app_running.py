
import socket

def check_port(host, port, service_name):
    print(f"Checking {service_name} on {host}:{port}...")
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(2)
            result = s.connect_ex((host, port))
            if result == 0:
                print(f"✅ {service_name} is RUNNING on port {port}.")
                return True
            else:
                print(f"❌ {service_name} is NOT running on port {port}.")
                return False
    except Exception as e:
        print(f"❌ Error checking {service_name}: {e}")
        return False

if __name__ == "__main__":
    frontend_ok = check_port("localhost", 3000, "Frontend (Vite)")
    backend_ok = check_port("127.0.0.1", 8000, "Backend (FastAPI)")
    
    if frontend_ok and backend_ok:
        print("\nAll systems go! Open http://localhost:3000 in your browser.")
    elif not frontend_ok:
        print("\nFrontend seems down. Try running 'npm run dev'.")
    elif not backend_ok:
        print("\nBackend seems down. Try running 'python main.py'.")
