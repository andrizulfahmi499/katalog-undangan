import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const member = await prisma.member.findUnique({
        where: { email: 'andryzulfahmy@gmail.com' },
        include: { invitations: true }
    });
    if (!member) {
        console.log('not found');
        return;
    }

    try {
        await prisma.$transaction([
            prisma.creditTransaction.deleteMany({ where: { memberId: member.id } }),
            prisma.invitationMessages.deleteMany({ where: { memberId: member.id } }),
            prisma.invitationSends.deleteMany({ where: { memberId: member.id } }),
            prisma.invitations.deleteMany({ where: { assignedMemberId: member.id } }),
            prisma.member.delete({ where: { id: member.id } })
        ]);
        console.log('success');
    } catch(e) {
        console.log('ERROR JSON:', JSON.stringify(e));
        console.log('ERROR:', e);
    }
}

main().finally(() => prisma.$disconnect());
