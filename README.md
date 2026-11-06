# Parque Cidade Viva

## Arquivos 3D (`.blend` e `.glb`)

Os arquivos `.blend` (Blender) e `.glb` (glTF binário) são versionados com
[Git LFS](https://git-lfs.com), configurado em `.gitattributes`.

- `modelos/blend/` — arquivos de trabalho do Blender
- `modelos/glb/` — modelos exportados em `.glb`

### Primeira vez

Instale o Git LFS e ative no seu computador (só precisa fazer uma vez):

```bash
git lfs install
```

Depois é só clonar o repositório normalmente.

### Fluxo para editar um modelo

Arquivos binários não podem ser mesclados. Antes de editar, trave o arquivo
para que ninguém mais o altere ao mesmo tempo:

```bash
git pull
git lfs lock modelos/blend/nome-do-arquivo.blend
```

Edite, salve, faça commit e push. Depois libere o arquivo:

```bash
git lfs unlock modelos/blend/nome-do-arquivo.blend
```

Para ver quem está com arquivos travados:

```bash
git lfs locks
```
