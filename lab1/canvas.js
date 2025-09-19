function initCanvas() {
    const canvas = document.getElementById('coordinate_plane')
    const ctx = canvas.getContext('2d')
    ctx.font = '13px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    return ctx;
    }